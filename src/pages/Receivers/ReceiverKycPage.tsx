import {useCallback, useEffect, useState} from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  CircleCheck,
  CircleMinus,
  Download,
  Play,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {
  approveReceiver,
  fetchReceiver,
  formatInr,
  rejectReceiver,
  type AdminReceiverProfile,
} from '../../api/receivers';
import {ApiError} from '../../api/client';
import styles from './ReceiverKycPage.module.css';

export function ReceiverKycPage() {
  const {receiverId = ''} = useParams();
  const [searchParams] = useSearchParams();
  const fromVerification = searchParams.get('from') === 'verification';
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminReceiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const load = useCallback(async () => {
    if (!receiverId) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchReceiver(receiverId);
      setProfile(result.receiver);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiError ? err.message : 'Failed to load KYC.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [receiverId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!rejectOpen) {
      setRejectReason('');
      setRejectError('');
    }
  }, [rejectOpen]);

  if (notFound) {
    return (
      <Navigate
        to={fromVerification ? '/verification' : '/receivers'}
        replace
      />
    );
  }

  const kyc = profile?.kyc;
  const canReview = Boolean(profile && kyc && kyc.reviewStatus === 'pending');
  const backTo = fromVerification
    ? '/verification'
    : profile
      ? `/receivers/${profile.id}`
      : '/receivers';
  const backLabel = fromVerification
    ? 'Back to Approvals'
    : 'Back to Receiver Profile';

  async function runAction(fn: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Action failed. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function confirmReject() {
    if (!profile) return;
    if (!rejectReason.trim()) {
      setRejectError('Please enter a rejection reason.');
      return;
    }
    await runAction(async () => {
      await rejectReceiver(profile.id, rejectReason.trim());
      setRejectOpen(false);
      navigate(fromVerification ? '/verification' : `/receivers/${profile.id}`);
    });
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.topBar}>
          <div>
            <Link to={backTo} className={styles.back}>
              <ArrowLeft size={15} strokeWidth={2.5} />
              {backLabel}
            </Link>
            <h1 className={styles.title}>Review Receiver Profile</h1>
            <p className={styles.subtitle}>
              Verify all information before approving the receiver
            </p>
          </div>

          {profile && canReview ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnReject}
                disabled={busy}
                onClick={() => setRejectOpen(true)}
              >
                <CircleMinus size={15} />
                Reject
              </button>
              <button
                type="button"
                className={styles.btnApprove}
                disabled={busy}
                onClick={() =>
                  void runAction(async () => {
                    if (!profile) return;
                    await approveReceiver(profile.id);
                    navigate(`/receivers/${profile.id}/approved`);
                  })
                }
              >
                <CircleCheck size={15} />
                Approve Receiver
              </button>
            </div>
          ) : null}
        </div>

        {loading ? <p className={styles.loadingState}>Loading KYC…</p> : null}
        {error ? <p className={styles.errorState}>{error}</p> : null}

        {profile && kyc ? (
          <div className={styles.layout}>
            <div className={styles.left}>
              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>Basic Information</h2>
                  <span className={styles.verifiedBadge}>Verified by Agent</span>
                </div>
                <dl className={styles.infoGrid}>
                  <div>
                    <dt>Name</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div>
                    <dt>Age</dt>
                    <dd>{kyc.age || '—'}</dd>
                  </div>
                  <div>
                    <dt>Gender</dt>
                    <dd>{profile.gender || '—'}</dd>
                  </div>
                  <div>
                    <dt>Level</dt>
                    <dd>
                      <span className={styles.level}>Level {kyc.level}</span>
                    </dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                  Profile Photos ({kyc.photos.length})
                </h2>
                {kyc.photos.length === 0 ? (
                  <p className={styles.emptyNote}>No photos uploaded.</p>
                ) : (
                  <div className={styles.photos}>
                    {kyc.photos.map((src, index) => (
                      <div key={`${src}-${index}`} className={styles.photo}>
                        <img src={src} alt={`Profile photo ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Bio</h2>
                <p className={styles.bio}>{kyc.bio || 'No bio provided.'}</p>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Languages</h2>
                <div className={styles.tags}>
                  {profile.languages.length === 0 ? (
                    <span>None</span>
                  ) : (
                    profile.languages.map(lang => (
                      <span key={lang}>{lang}</span>
                    ))
                  )}
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Bank Account Details</h2>
                <dl className={styles.kv}>
                  <div>
                    <dt>Account Holder Name</dt>
                    <dd>{kyc.bank.holderName || '—'}</dd>
                  </div>
                  <div>
                    <dt>Account Number</dt>
                    <dd>
                      {kyc.bank.accountNumber
                        ? `****${kyc.bank.accountNumber.slice(-4)}`
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>IFSC Code</dt>
                    <dd>{kyc.bank.ifsc || '—'}</dd>
                  </div>
                  <div>
                    <dt>UPI ID</dt>
                    <dd>{kyc.bank.upiId || '—'}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className={styles.right}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Submission Info</h2>
                <dl className={styles.kv}>
                  <div>
                    <dt>Receiver ID</dt>
                    <dd>{kyc.receiverId}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{kyc.submitted}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span
                        className={
                          kyc.reviewStatus === 'approved'
                            ? styles.approved
                            : kyc.reviewStatus === 'rejected'
                              ? styles.rejected
                              : kyc.reviewStatus === 'pending'
                                ? styles.pending
                                : styles.incomplete
                        }
                      >
                        {kyc.reviewStatus === 'approved'
                          ? 'Approved'
                          : kyc.reviewStatus === 'rejected'
                            ? 'Rejected'
                            : kyc.reviewStatus === 'pending'
                              ? 'Pending Review'
                              : 'Not Submitted'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Agent Information</h2>
                <dl className={styles.kv}>
                  <div>
                    <dt>Agent</dt>
                    <dd>{profile.agentName || '—'}</dd>
                  </div>
                  <div>
                    <dt>Agent ID</dt>
                    <dd>{profile.agentCode || profile.agentId || '—'}</dd>
                  </div>
                  <div>
                    <dt>Commission</dt>
                    <dd>{formatInr(profile.agentCommission || 0)}</dd>
                  </div>
                </dl>
                {profile.agentId ? (
                  <Link
                    to={`/agents/${profile.agentId}`}
                    className={styles.agentLink}
                  >
                    View Agent Profile
                  </Link>
                ) : null}
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Video Verification</h2>
                <div
                  className={styles.video}
                  style={
                    kyc.videoThumb
                      ? {backgroundImage: `url(${kyc.videoThumb})`}
                      : undefined
                  }
                >
                  {kyc.videoUrl ? (
                    <a
                      href={kyc.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.playBtn}
                    >
                      <Play size={16} fill="currentColor" />
                      Play Video
                    </a>
                  ) : (
                    <button type="button" className={styles.playBtn} disabled>
                      <Play size={16} fill="currentColor" />
                      No video
                    </button>
                  )}
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>KYC Documents</h2>
                {kyc.documents.length === 0 ? (
                  <p className={styles.emptyNote}>No documents uploaded.</p>
                ) : (
                  <ul className={styles.docs}>
                    {kyc.documents.map(doc => (
                      <li key={doc.id}>
                        <img src={doc.thumbnail || undefined} alt="" />
                        <div>
                          <p>{doc.title}</p>
                          <span>{doc.sizeLabel}</span>
                        </div>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.download}
                            aria-label={`Download ${doc.title}`}
                          >
                            <Download size={16} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            className={styles.download}
                            disabled
                            aria-label={`Download ${doc.title}`}
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        ) : null}

        {rejectOpen ? (
          <div
            className={styles.modalOverlay}
            role="presentation"
            onClick={() => setRejectOpen(false)}
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reject-title"
              onClick={event => event.stopPropagation()}
            >
              <h2 id="reject-title">Reject Receiver Profile</h2>
              <p>
                Please provide a reason for rejecting this profile. The receiver
                will be notified.
              </p>
              <textarea
                rows={5}
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={event => {
                  setRejectReason(event.target.value);
                  if (rejectError) setRejectError('');
                }}
              />
              {rejectError ? (
                <p className={styles.modalError}>{rejectError}</p>
              ) : null}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={() => setRejectOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.modalConfirm}
                  disabled={busy}
                  onClick={() => void confirmReject()}
                >
                  Reject Profile
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
