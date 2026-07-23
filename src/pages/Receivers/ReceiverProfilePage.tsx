import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
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
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {ReceiverStatusBadge} from '../../components/receivers/ReceiverStatusBadge/ReceiverStatusBadge';
import {
  fetchReceiver,
  formatInr,
  formatNumber,
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

export function ReceiverProfilePage() {
  const {receiverId = ''} = useParams();
  const [profile, setProfile] = useState<AdminReceiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

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

  async function onAction(action: 'block' | 'suspend' | 'activate') {
    if (!profile) return;
    try {
      const result = await updateReceiverStatus(profile.id, action);
      setProfile(result.receiver);
      setActionMessage(
        action === 'block'
          ? 'Receiver blocked.'
          : action === 'suspend'
            ? 'Receiver suspended.'
            : 'Receiver activated.',
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update receiver.',
      );
    }
  }

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
                  <button type="button" className={styles.actionInfo}>
                    <Pencil size={15} />
                    Edit Receiver
                  </button>
                  <button
                    type="button"
                    className={styles.actionWarn}
                    onClick={() =>
                      void onAction(
                        profile.status === 'active' ? 'suspend' : 'activate',
                      )
                    }
                  >
                    <PauseCircle size={15} />
                    {profile.status === 'active'
                      ? 'Suspend Receiver'
                      : 'Activate Receiver'}
                  </button>
                  <button
                    type="button"
                    className={styles.actionDanger}
                    onClick={() => void onAction('block')}
                    disabled={profile.status === 'blocked'}
                  >
                    <Ban size={15} />
                    Block Receiver
                  </button>
                  <button type="button" className={styles.action}>
                    <UserPlus size={15} />
                    Assign New Agent
                  </button>
                  <button type="button" className={styles.action}>
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
                      <dd>{profile.performance.onlineHours}h</dd>
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
                <section className={styles.card}>
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
    </DashboardShell>
  );
}
