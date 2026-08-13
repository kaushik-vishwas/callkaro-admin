import {useCallback, useEffect, useState, type FormEvent} from 'react';
import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, Ban, UserPlus, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ComplianceSubnav} from '../../components/compliance/ComplianceSubnav/ComplianceSubnav';
import {ApiError} from '../../api/client';
import {fetchAgents, type AdminAgentListItem} from '../../api/agents';
import {
  assignComplianceCase,
  blockComplianceCase,
  dismissComplianceCase,
  fetchComplianceCase,
  type ComplianceCase,
} from '../../api/compliance';
import styles from './ComplianceDetail.module.css';

type Props = {
  mode: 'identity' | 'detected';
};

export function ComplianceCaseDetailPage({mode}: Props) {
  const {caseId = ''} = useParams();
  const navigate = useNavigate();
  const backTo =
    mode === 'identity' ? '/compliance' : '/compliance/detected-profiles';

  const [item, setItem] = useState<ComplianceCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [agents, setAgents] = useState<AdminAgentListItem[]>([]);
  const [agentId, setAgentId] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchComplianceCase(caseId);
      setItem(result.case);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(err instanceof ApiError ? err.message : 'Failed to load case.');
      }
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!assignOpen) return;
    void fetchAgents({tab: 'active', limit: 50})
      .then(result => {
        setAgents(result.agents || []);
        if (result.agents?.[0]?.id) setAgentId(result.agents[0].id);
      })
      .catch(() => setAgents([]));
  }, [assignOpen]);

  if (notFound) {
    return <Navigate to={backTo} replace />;
  }

  async function onDismiss() {
    if (!item) return;
    setBusy(true);
    setError('');
    try {
      const result = await dismissComplianceCase(item.id);
      setItem(result.case);
      setMessage('Case dismissed.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Dismiss failed.');
    } finally {
      setBusy(false);
    }
  }

  async function onBlock() {
    if (!item) return;
    setBusy(true);
    setError('');
    try {
      const result = await blockComplianceCase(item.id);
      setItem(result.case);
      setMessage('User blocked.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Block failed.');
    } finally {
      setBusy(false);
    }
  }

  async function onAssign(event: FormEvent) {
    event.preventDefault();
    if (!item || !agentId) return;
    setBusy(true);
    setError('');
    try {
      const result = await assignComplianceCase(item.id, agentId, note);
      setItem(result.case);
      setAssignOpen(false);
      setNote('');
      setMessage('Case assigned to agent.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Assign failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <ComplianceSubnav />
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate(backTo)}
        >
          <ArrowLeft size={16} />
          Back to list
        </button>

        {loading ? <p>Loading case…</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.success}>{message}</p> : null}

        {item ? (
          <div className={styles.layout}>
            <div className={styles.main}>
              <header className={styles.head}>
                <div>
                  <div className={styles.titleRow}>
                    <h1 className={styles.title}>Case {item.caseCode}</h1>
                    <span className={[styles.badge, styles[item.status]].join(' ')}>
                      {item.statusLabel}
                    </span>
                  </div>
                  <p className={styles.muted}>
                    Reported {item.reportDateLabel}
                  </p>
                </div>
              </header>

              <section className={styles.summaryGrid}>
                <article>
                  <p className={styles.label}>Caller</p>
                  <strong>{item.callerName}</strong>
                  <p className={styles.muted}>{item.callerPhone || '—'}</p>
                </article>
                <article>
                  <p className={styles.label}>Receiver</p>
                  <strong>{item.receiverName}</strong>
                </article>
                <article>
                  <p className={styles.label}>Detection Source</p>
                  <strong>{item.detectionSource}</strong>
                  <p className={styles.muted}>{item.reportDateLabel}</p>
                </article>
                <article>
                  <p className={styles.label}>Assigned Agent</p>
                  <strong>{item.assignedAgentName || 'Unassigned'}</strong>
                </article>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Receiver Information</h2>
                <div className={styles.receiverRow}>
                  <span className={styles.avatar}>
                    {item.receiverName.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className={styles.receiverName}>{item.receiverName}</p>
                    <p className={styles.muted}>
                      Member since {item.receiverMemberSince || '—'}
                    </p>
                  </div>
                  <span className={styles.statusPill}>
                    {item.receiverStatus || 'unknown'}
                  </span>
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Evidence Review</h2>
                {item.videoUrl ? (
                  <video
                    className={styles.video}
                    controls
                    poster={item.videoThumb || undefined}
                    src={item.videoUrl}
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>
                    Receiver Verification Video
                    <span className={styles.muted}>
                      {item.videoEvidence
                        ? 'Video unavailable'
                        : 'No verification video on file'}
                    </span>
                  </div>
                )}
                <p className={styles.muted} style={{marginTop: 12}}>
                  Reason: {item.reason}
                  {item.details ? ` — ${item.details}` : ''}
                </p>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Case Timeline</h2>
                <ol className={styles.timeline}>
                  {item.timeline.length === 0 ? (
                    <li className={styles.muted}>No timeline events.</li>
                  ) : (
                    item.timeline.map(event => (
                      <li key={event.id}>
                        <strong>{event.title}</strong>
                        <p className={styles.muted}>
                          {event.actor} · {event.atLabel}
                        </p>
                      </li>
                    ))
                  )}
                </ol>
              </section>
            </div>

            <aside className={styles.side}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Quick Actions</h2>
                <div className={styles.actions}>
                  {mode === 'identity' ? (
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      disabled={busy}
                      onClick={() => setAssignOpen(true)}
                    >
                      <UserPlus size={15} />
                      Assign to Agent
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    disabled={busy || item.status === 'dismissed'}
                    onClick={() => void onDismiss()}
                  >
                    Dismiss Case
                  </button>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    disabled={busy || item.status === 'blocked'}
                    onClick={() => void onBlock()}
                  >
                    <Ban size={15} />
                    Block Receiver Directly
                  </button>
                  {item.autoBlockLabel ? (
                    <p className={styles.muted}>{item.autoBlockLabel}</p>
                  ) : null}
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Case Details</h2>
                <dl className={styles.kv}>
                  <div>
                    <dt>Case ID</dt>
                    <dd>{item.caseCode}</dd>
                  </div>
                  <div>
                    <dt>Report Date</dt>
                    <dd>{item.reportDateLabel}</dd>
                  </div>
                  <div>
                    <dt>Detection Source</dt>
                    <dd>{item.detectionSource}</dd>
                  </div>
                  <div>
                    <dt>Video Evidence</dt>
                    <dd>{item.videoEvidence ? 'Available' : 'Unavailable'}</dd>
                  </div>
                  <div>
                    <dt>Duplicate Reports</dt>
                    <dd>{item.duplicateLabel}</dd>
                  </div>
                </dl>
                {item.receiverId ? (
                  <Link
                    to={`/receivers/${item.receiverId}`}
                    className={styles.link}
                  >
                    Open receiver profile
                  </Link>
                ) : null}
              </section>
            </aside>
          </div>
        ) : null}
      </div>

      {assignOpen ? (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={() => setAssignOpen(false)}
        >
          <form
            className={styles.modal}
            role="dialog"
            onClick={event => event.stopPropagation()}
            onSubmit={event => void onAssign(event)}
          >
            <div className={styles.modalHead}>
              <h2>Assign to Agent</h2>
              <button
                type="button"
                className={styles.close}
                onClick={() => setAssignOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p className={styles.muted}>Case {item?.caseCode}</p>
            <label className={styles.field}>
              Agent
              <select
                value={agentId}
                onChange={event => setAgentId(event.target.value)}
                required
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.code}) · {agent.receivers} receivers
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              Assignment notes
              <textarea
                value={note}
                onChange={event => setNote(event.target.value)}
                rows={3}
                placeholder="Add investigation notes for the agent."
              />
            </label>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setAssignOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={busy}>
                {busy ? 'Assigning…' : 'Assign Investigation'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardShell>
  );
}
