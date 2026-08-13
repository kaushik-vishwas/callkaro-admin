import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  FileText,
  Languages,
  Mail,
  MapPin,
  PauseCircle,
  Pencil,
  Phone,
  UserPlus,
  Wallet,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {CallerConfirmModal} from '../../components/callers/CallerActionModal/CallerActionModal';
import {
  ReceiverAssignAgentModal,
  ReceiverEditModal,
} from '../../components/receivers/ReceiverActionModal/ReceiverActionModal';
import {ReceiverStatusBadge} from '../../components/receivers/ReceiverStatusBadge/ReceiverStatusBadge';
import {
  assignReceiverAgent,
  fetchReceiver,
  formatInr,
  formatNumber,
  updateReceiverProfile,
  updateReceiverStatus,
  type AdminReceiverProfile,
} from '../../api/receivers';
import {ApiError} from '../../api/client';
import styles from './ReceiverProfilePage.module.css';

function RevenueTrendChart({
  data,
}: {
  data: Array<{month: string; value: number}>;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const WIDTH = 560;
  const HEIGHT = 200;
  const PAD = {top: 16, right: 12, bottom: 28, left: 40};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const points = data.map((item, index) => {
    const x = PAD.left + (index / Math.max(1, data.length - 1)) * innerW;
    const y = PAD.top + innerH - (item.value / max) * innerH;
    return {x, y, ...item};
  });

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${(
    PAD.top + innerH
  ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD.top + innerH).toFixed(
    1,
  )} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={styles.chartSvg}
      role="img"
      aria-label="Revenue trend last 6 months"
    >
      <path d={area} className={styles.area} />
      <path d={line} className={styles.line} />
      {points.map(point => (
        <g key={point.month}>
          <circle cx={point.x} cy={point.y} r={3.5} className={styles.dot} />
          <text x={point.x} y={HEIGHT - 8} className={styles.chartLabel}>
            {point.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function formatOnlineHours(value: number) {
  return `${Number(value || 0).toFixed(2)}h`;
}

type DialogKind = 'block' | 'suspend' | 'activate' | 'edit' | 'assign' | null;

export function ReceiverProfilePage() {
  const {receiverId = ''} = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminReceiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [dialogBusy, setDialogBusy] = useState(false);
  const [dialogError, setDialogError] = useState('');

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
          err instanceof ApiError ? err.message : 'Failed to load receiver.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [receiverId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (notFound) {
    return <Navigate to="/receivers" replace />;
  }

  function closeDialog() {
    if (dialogBusy) return;
    setDialog(null);
    setDialogError('');
  }

  async function onConfirmModeration(reason: string) {
    if (
      !profile ||
      (dialog !== 'block' && dialog !== 'suspend' && dialog !== 'activate')
    ) {
      return;
    }
    setDialogBusy(true);
    setDialogError('');
    try {
      const result = await updateReceiverStatus(profile.id, dialog, reason);
      setProfile(result.receiver);
      setActionMessage(
        dialog === 'block'
          ? 'Receiver blocked.'
          : dialog === 'suspend'
            ? 'Receiver suspended.'
            : 'Receiver activated.',
      );
      setDialog(null);
    } catch (err) {
      setDialogError(
        err instanceof ApiError ? err.message : 'Action failed.',
      );
    } finally {
      setDialogBusy(false);
    }
  }

  async function onSaveProfile(payload: {
    name: string;
    email: string;
    age: number;
    gender: string;
    level: number;
    bio: string;
    languages: string;
  }) {
    if (!profile) return;
    setDialogBusy(true);
    setDialogError('');
    try {
      const result = await updateReceiverProfile(profile.id, payload);
      setProfile(result.receiver);
      setActionMessage('Receiver profile updated.');
      setDialog(null);
    } catch (err) {
      setDialogError(
        err instanceof ApiError ? err.message : 'Failed to save profile.',
      );
    } finally {
      setDialogBusy(false);
    }
  }

  async function onAssignAgent(agentId: string) {
    if (!profile) return;
    setDialogBusy(true);
    setDialogError('');
    try {
      const result = await assignReceiverAgent(profile.id, agentId);
      setProfile(result.receiver);
      setActionMessage('Agent assigned successfully.');
      setDialog(null);
    } catch (err) {
      setDialogError(
        err instanceof ApiError ? err.message : 'Failed to assign agent.',
      );
    } finally {
      setDialogBusy(false);
    }
  }

  function onViewWithdrawals() {
    if (!profile) return;
    navigate(
      `/withdrawals?q=${encodeURIComponent(profile.id)}&receiverId=${encodeURIComponent(profile.id)}`,
    );
  }

  const needsActivate =
    profile?.status === 'blocked' || profile?.status === 'inactive';

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.topRow}>
          <Link to="/receivers" className={styles.back}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            {profile
              ? `${profile.name} ${profile.code} — Receiver Profile`
              : 'Receiver Profile'}
          </Link>
          {profile ? (
            <Link
              to={`/receivers/${profile.id}/kyc`}
              className={styles.kycBtn}
            >
              View KYC Profile
            </Link>
          ) : null}
        </div>

        {loading ? (
          <p className={styles.loadingState}>Loading receiver…</p>
        ) : null}
        {error ? <p className={styles.errorState}>{error}</p> : null}
        {actionMessage ? (
          <p className={styles.successState}>{actionMessage}</p>
        ) : null}

        {profile ? (
          <div className={styles.layout}>
            <aside className={styles.left}>
              <section className={styles.card}>
                <div className={styles.profileHead}>
                  <CallerAvatar name={profile.name} size="lg" />
                  <div>
                    <h1 className={styles.name}>{profile.name}</h1>
                    <p className={styles.code}>{profile.code}</p>
                    <ReceiverStatusBadge status={profile.status} />
                  </div>
                </div>
                <ul className={styles.metaList}>
                  <li>
                    <Phone size={15} />
                    <span>{profile.phone || '—'}</span>
                  </li>
                  <li>
                    <Mail size={15} />
                    <span>{profile.email || '—'}</span>
                  </li>
                  <li>
                    <MapPin size={15} />
                    <span>{profile.location || '—'}</span>
                  </li>
                  <li>
                    <Languages size={15} />
                    <span>
                      {profile.gender || '—'}
                      {profile.languages.length
                        ? ` · ${profile.languages.join(', ')}`
                        : ''}
                    </span>
                  </li>
                  <li>
                    <Calendar size={15} />
                    <span>Joined {profile.joinedAt}</span>
                  </li>
                </ul>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Agent Information</h2>
                <div className={styles.agentBox}>
                  <div>
                    <p className={styles.agentName}>{profile.agentName}</p>
                    <p className={styles.agentCode}>{profile.agentCode}</p>
                  </div>
                  <div className={styles.agentCommission}>
                    <span>Commission</span>
                    <strong>{formatInr(profile.agentCommission)}</strong>
                  </div>
                </div>
                {profile.agentId ? (
                  <Link
                    to={`/agents/${profile.agentId}`}
                    className={styles.linkBtn}
                  >
                    View Agent Profile
                  </Link>
                ) : (
                  <button type="button" className={styles.linkBtn} disabled>
                    View Agent Profile
                  </button>
                )}
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Admin Actions</h2>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.actionInfo}
                    onClick={() => {
                      setDialogError('');
                      setDialog('edit');
                    }}
                  >
                    <Pencil size={15} />
                    Edit Receiver
                  </button>
                  {needsActivate ? (
                    <button
                      type="button"
                      className={styles.actionWarn}
                      onClick={() => {
                        setDialogError('');
                        setDialog('activate');
                      }}
                    >
                      <CheckCircle2 size={15} />
                      Activate Receiver
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.actionWarn}
                      onClick={() => {
                        setDialogError('');
                        setDialog('suspend');
                      }}
                    >
                      <PauseCircle size={15} />
                      Suspend Receiver
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.actionDanger}
                    onClick={() => {
                      setDialogError('');
                      setDialog('block');
                    }}
                    disabled={profile.status === 'blocked'}
                  >
                    <Ban size={15} />
                    Block Receiver
                  </button>
                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => {
                      setDialogError('');
                      setDialog('assign');
                    }}
                  >
                    <UserPlus size={15} />
                    Assign New Agent
                  </button>
                  <button
                    type="button"
                    className={styles.action}
                    onClick={onViewWithdrawals}
                  >
                    <Wallet size={15} />
                    View Withdrawals
                  </button>
                </div>
              </section>
            </aside>

            <div className={styles.right}>
              <div className={styles.summaryRow}>
                <article className={styles.summaryCard}>
                  <p>Coins Earned</p>
                  <strong className={styles.pink}>
                    {formatNumber(profile.coinsEarned)}
                  </strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>Total Earnings</p>
                  <strong className={styles.pink}>
                    {formatInr(profile.earnings)}
                  </strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>Available Balance</p>
                  <strong className={styles.green}>
                    {formatInr(profile.availableBalance)}
                  </strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>Rank</p>
                  <strong className={styles.gold}>#{profile.rank}</strong>
                </article>
              </div>

              <div className={styles.twoCol}>
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Earnings Dashboard</h2>
                  <dl className={styles.kv}>
                    <div>
                      <dt>Total Earnings</dt>
                      <dd>{formatInr(profile.earnings)}</dd>
                    </div>
                    <div>
                      <dt>Withdrawn Amount</dt>
                      <dd>{formatInr(profile.withdrawnAmount)}</dd>
                    </div>
                    <div>
                      <dt>Available Balance</dt>
                      <dd>{formatInr(profile.availableBalance)}</dd>
                    </div>
                    <div>
                      <dt>Revenue Generated</dt>
                      <dd>{formatInr(profile.revenue)}</dd>
                    </div>
                  </dl>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Performance Analytics</h2>
                  <dl className={styles.kv}>
                    <div>
                      <dt>Current Rank</dt>
                      <dd>#{profile.rank}</dd>
                    </div>
                    <div>
                      <dt>Calls This Month</dt>
                      <dd>{profile.performance.callsThisMonth}</dd>
                    </div>
                    <div>
                      <dt>Completed Calls</dt>
                      <dd>{profile.performance.completed}</dd>
                    </div>
                    <div>
                      <dt>Missed Calls</dt>
                      <dd>{profile.performance.missed}</dd>
                    </div>
                    <div>
                      <dt>Online Hours</dt>
                      <dd>
                        {formatOnlineHours(profile.performance.onlineHours)}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                  Revenue Trend — Last 6 Months
                </h2>
                <RevenueTrendChart data={profile.revenueTrend} />
              </section>

              <div className={styles.twoCol}>
                <section className={styles.card} id="withdrawal-history">
                  <h2 className={styles.cardTitle}>Withdrawal History</h2>
                  <div className={styles.miniTableWrap}>
                    <table className={styles.miniTable}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Settlement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.withdrawals.length === 0 ? (
                          <tr>
                            <td colSpan={4}>No withdrawals yet.</td>
                          </tr>
                        ) : null}
                        {profile.withdrawals.map(row => (
                          <tr key={row.id}>
                            <td>{row.date}</td>
                            <td>{formatInr(row.amount)}</td>
                            <td>
                              <span
                                className={[
                                  styles.wdStatus,
                                  styles[`wd_${row.status}`],
                                ].join(' ')}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td>{row.settlement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Compliance</h2>
                  <div className={styles.complianceGrid}>
                    <article>
                      <p>Warnings</p>
                      <strong>{profile.compliance.warnings}</strong>
                    </article>
                    <article>
                      <p>Violations</p>
                      <strong>{profile.compliance.violations}</strong>
                    </article>
                    <article
                      className={
                        profile.compliance.aiFlags > 0 ? styles.flagged : ''
                      }
                    >
                      <p>AI Flags</p>
                      <strong>{profile.compliance.aiFlags}</strong>
                    </article>
                    <article>
                      <p>Contact Reports</p>
                      <strong>{profile.compliance.contactReports}</strong>
                    </article>
                  </div>
                  <div className={styles.complianceNote}>
                    <FileText size={14} />
                    Review flagged activity before next payout.
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <CallerConfirmModal
        open={dialog === 'block'}
        title="Block Receiver"
        description={`Block ${profile?.name || 'this receiver'}? They will lose access.`}
        confirmLabel="Block Receiver"
        tone="danger"
        busy={dialogBusy}
        error={dialogError}
        onClose={closeDialog}
        onConfirm={onConfirmModeration}
      />
      <CallerConfirmModal
        open={dialog === 'suspend'}
        title="Suspend Receiver"
        description={`Suspend ${profile?.name || 'this receiver'}? Access will be paused until activated.`}
        confirmLabel="Suspend Receiver"
        tone="warn"
        busy={dialogBusy}
        error={dialogError}
        onClose={closeDialog}
        onConfirm={onConfirmModeration}
      />
      <CallerConfirmModal
        open={dialog === 'activate'}
        title="Activate Receiver"
        description={`Restore access for ${profile?.name || 'this receiver'}?`}
        confirmLabel="Activate Receiver"
        tone="default"
        busy={dialogBusy}
        error={dialogError}
        onClose={closeDialog}
        onConfirm={onConfirmModeration}
      />
      {profile ? (
        <ReceiverEditModal
          open={dialog === 'edit'}
          profile={profile}
          busy={dialogBusy}
          error={dialogError}
          onClose={closeDialog}
          onSave={onSaveProfile}
        />
      ) : null}
      <ReceiverAssignAgentModal
        open={dialog === 'assign'}
        currentAgentId={profile?.agentId}
        busy={dialogBusy}
        error={dialogError}
        onClose={closeDialog}
        onAssign={onAssignAgent}
      />
    </DashboardShell>
  );
}
