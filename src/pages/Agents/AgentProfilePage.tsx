import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  KeyRound,
  Mail,
  MapPin,
  PauseCircle,
  Pencil,
  Phone,
  ScrollText,
  Wallet,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {AgentStatusBadge} from '../../components/agents/AgentStatusBadge/AgentStatusBadge';
import {ReceiverStatusBadge} from '../../components/receivers/ReceiverStatusBadge/ReceiverStatusBadge';
import {
  fetchAgent,
  formatInr,
  formatNumber,
  resetAgentPassword,
  updateAgent,
  type AdminAgentProfile,
} from '../../api/agents';
import {ApiError} from '../../api/client';
import styles from './AgentProfilePage.module.css';

function EarningsTrendChart({
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
      aria-label="Earnings trend last 6 months"
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

export function AgentProfilePage() {
  const {agentId = ''} = useParams();
  const [profile, setProfile] = useState<AdminAgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchAgent(agentId);
      setProfile(result.agent);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiError ? err.message : 'Failed to load agent.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (notFound) {
    return <Navigate to="/agents" replace />;
  }

  async function onSuspend() {
    if (!profile) return;
    try {
      const result = await updateAgent(profile.id, {
        isActive: profile.status !== 'active',
      });
      setProfile(result.agent);
      setActionMessage(
        result.agent.status === 'active'
          ? 'Agent reactivated.'
          : 'Agent suspended.',
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update agent.',
      );
    }
  }

  async function onResetPassword() {
    if (!profile) return;
    try {
      const result = await resetAgentPassword(profile.id);
      setActionMessage(`New password: ${result.temporaryPassword}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to reset password.',
      );
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <Link to="/agents" className={styles.back}>
          <ArrowLeft size={16} strokeWidth={2.5} />
          {profile
            ? `${profile.name} ${profile.code} — Agent Profile`
            : 'Agent Profile'}
        </Link>

        {loading ? <p className={styles.loadingState}>Loading agent…</p> : null}
        {error ? <p className={styles.errorState}>{error}</p> : null}
        {actionMessage ? (
          <p className={styles.successState}>{actionMessage}</p>
        ) : null}

        {profile ? (
          <>
            <div className={styles.summaryRow}>
              <article className={styles.summaryCard}>
                <p>Commission Earned</p>
                <strong className={styles.pink}>
                  {formatInr(profile.commission)}
                </strong>
              </article>
              <article className={styles.summaryCard}>
                <p>Pending Commission</p>
                <strong>{formatInr(profile.pending)}</strong>
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

            <div className={styles.layout}>
              <aside className={styles.left}>
                <section className={styles.card}>
                  <div className={styles.profileHead}>
                    <CallerAvatar name={profile.name} size="lg" />
                    <div>
                      <h1 className={styles.name}>{profile.name}</h1>
                      <p className={styles.code}>{profile.code}</p>
                      <AgentStatusBadge status={profile.status} />
                    </div>
                  </div>
                  <ul className={styles.metaList}>
                    <li>
                      <Phone size={15} />
                      <span>{profile.phone || '—'}</span>
                    </li>
                    <li>
                      <Mail size={15} />
                      <span>{profile.email}</span>
                    </li>
                    <li>
                      <MapPin size={15} />
                      <span>{profile.location || '—'}</span>
                    </li>
                    <li>
                      <Calendar size={15} />
                      <span>Joined {profile.joinedAt}</span>
                    </li>
                    <li>
                      <Clock size={15} />
                      <span>Last active {profile.lastActive}</span>
                    </li>
                  </ul>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Team Overview</h2>
                  <dl className={styles.kv}>
                    <div>
                      <dt>Total Receivers</dt>
                      <dd>{profile.team.totalReceivers}</dd>
                    </div>
                    <div>
                      <dt>Active Receivers</dt>
                      <dd>{profile.team.activeReceivers}</dd>
                    </div>
                    <div>
                      <dt>Online Now</dt>
                      <dd>{profile.team.onlineNow}</dd>
                    </div>
                    <div>
                      <dt>Blocked</dt>
                      <dd>{profile.team.blocked}</dd>
                    </div>
                    <div>
                      <dt>Inactive</dt>
                      <dd>{profile.team.inactive}</dd>
                    </div>
                  </dl>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Admin Actions</h2>
                  <div className={styles.actions}>
                    <button type="button" className={styles.actionInfo}>
                      <Pencil size={15} />
                      Edit Agent
                    </button>
                    <button
                      type="button"
                      className={styles.actionWarn}
                      onClick={() => void onSuspend()}
                    >
                      <PauseCircle size={15} />
                      {profile.status === 'active'
                        ? 'Suspend Agent'
                        : 'Activate Agent'}
                    </button>
                    <button
                      type="button"
                      className={styles.action}
                      onClick={() => void onResetPassword()}
                    >
                      <KeyRound size={15} />
                      Reset Password
                    </button>
                    <button type="button" className={styles.action}>
                      <ScrollText size={15} />
                      Commission Ledger
                    </button>
                    <button type="button" className={styles.action}>
                      <Wallet size={15} />
                      View Withdrawals
                    </button>
                    <button type="button" className={styles.action}>
                      <Download size={15} />
                      Export Agent Data
                    </button>
                  </div>
                </section>
              </aside>

              <div className={styles.right}>
                <div className={styles.twoCol}>
                  <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Commission Dashboard</h2>
                    <dl className={styles.kv}>
                      <div>
                        <dt>Total Earned</dt>
                        <dd>
                          {formatInr(profile.commissionDashboard.totalEarned)}
                        </dd>
                      </div>
                      <div>
                        <dt>Pending</dt>
                        <dd>
                          {formatInr(profile.commissionDashboard.pending)}
                        </dd>
                      </div>
                      <div>
                        <dt>Available</dt>
                        <dd>
                          {formatInr(profile.commissionDashboard.available)}
                        </dd>
                      </div>
                      <div>
                        <dt>Lifetime Earnings</dt>
                        <dd>
                          {formatInr(
                            profile.commissionDashboard.lifetimeEarnings,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>Total Revenue Generated</dt>
                        <dd>
                          {formatInr(
                            profile.commissionDashboard.totalRevenueGenerated,
                          )}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Revenue Analytics</h2>
                    <dl className={styles.kv}>
                      <div>
                        <dt>Total Revenue</dt>
                        <dd>
                          {formatInr(profile.revenueAnalytics.totalRevenue)}
                        </dd>
                      </div>
                      <div>
                        <dt>Avg Rev / Receiver</dt>
                        <dd>
                          {formatInr(
                            profile.revenueAnalytics.avgRevPerReceiver,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>Monthly Revenue</dt>
                        <dd>
                          {formatInr(profile.revenueAnalytics.monthlyRevenue)}
                        </dd>
                      </div>
                      <div>
                        <dt>Growth %</dt>
                        <dd className={styles.growth}>
                          +{profile.revenueAnalytics.growthPct.toFixed(1)}%
                        </dd>
                      </div>
                      <div>
                        <dt>Revenue Rank</dt>
                        <dd>#{profile.revenueAnalytics.revenueRank}</dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    Earnings Trend — Last 6 Months
                  </h2>
                  <EarningsTrendChart data={profile.earningsTrend} />
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Receiver Performance</h2>
                  <div className={styles.miniTableWrap}>
                    <table className={styles.miniTable}>
                      <thead>
                        <tr>
                          <th>Receiver</th>
                          <th>Calls</th>
                          <th>Coins Earned</th>
                          <th>Revenue</th>
                          <th>Commission</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.receiverPerformance.length === 0 ? (
                          <tr>
                            <td colSpan={6}>No receivers assigned yet.</td>
                          </tr>
                        ) : null}
                        {profile.receiverPerformance.map(row => (
                          <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{formatNumber(row.calls)}</td>
                            <td>{formatNumber(row.coinsEarned)}</td>
                            <td>{formatInr(row.revenue)}</td>
                            <td>{formatInr(row.commission)}</td>
                            <td>
                              <ReceiverStatusBadge status={row.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Activity Timeline</h2>
                  <ol className={styles.timeline}>
                    {profile.timeline.map(item => (
                      <li key={item.id}>
                        <span
                          className={[
                            styles.timelineDot,
                            styles[`tone_${item.tone}`],
                          ].join(' ')}
                        />
                        <div>
                          <p className={styles.timelineTitle}>{item.title}</p>
                          <p className={styles.timelineDetail}>{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}
