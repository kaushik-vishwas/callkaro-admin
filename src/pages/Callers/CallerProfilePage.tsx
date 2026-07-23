import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  Download,
  KeyRound,
  PauseCircle,
  Ticket,
  Flag,
  Mail,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {StatusBadge} from '../../components/callers/StatusBadge/StatusBadge';
import {VipBadge} from '../../components/callers/VipBadge/VipBadge';
import {
  fetchCaller,
  formatInr,
  formatNumber,
  resetCallerPassword,
  type AdminCallerProfile,
} from '../../api/callers';
import {ApiError} from '../../api/client';
import styles from './CallerProfilePage.module.css';

function CallActivityChart({
  data,
}: {
  data: Array<{day: string; calls: number}>;
}) {
  const max = Math.max(...data.map(d => d.calls), 1);
  const WIDTH = 560;
  const HEIGHT = 180;
  const PAD = {top: 12, right: 8, bottom: 28, left: 8};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const barW = innerW / data.length / 2.2;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={styles.chartSvg}
      role="img"
      aria-label="Call activity last 7 days"
    >
      {data.map((item, index) => {
        const h = (item.calls / max) * innerH;
        const x =
          PAD.left + (index + 0.5) * (innerW / data.length) - barW / 2;
        const y = PAD.top + innerH - h;
        return (
          <g key={item.day}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(2, h)}
              rx={4}
              className={styles.bar}
            />
            <text
              x={x + barW / 2}
              y={HEIGHT - 8}
              className={styles.chartLabel}
            >
              {item.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function CallerProfilePage() {
  const {callerId = ''} = useParams();
  const [profile, setProfile] = useState<AdminCallerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!callerId) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchCaller(callerId);
      setProfile(result.caller);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiError ? err.message : 'Failed to load caller.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [callerId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (notFound) {
    return <Navigate to="/callers" replace />;
  }

  async function onResetPassword() {
    if (!profile) return;
    try {
      const result = await resetCallerPassword(profile.id);
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
        <Link to="/callers" className={styles.back}>
          <ArrowLeft size={16} strokeWidth={2.5} />
          {profile
            ? `${profile.name} ${profile.code} — Caller Profile`
            : 'Caller Profile'}
        </Link>

        {loading ? <p className={styles.loadingState}>Loading caller…</p> : null}
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
                    <StatusBadge status={profile.status} />
                  </div>
                </div>

                <ul className={styles.metaList}>
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
                    <span>Registered {profile.registeredAt}</span>
                  </li>
                  <li>
                    <Clock size={15} />
                    <span>Last active {profile.lastActive}</span>
                  </li>
                </ul>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Admin Actions</h2>
                <div className={styles.actions}>
                  <button type="button" className={styles.actionDanger}>
                    <Ban size={15} />
                    Block Caller
                  </button>
                  <button type="button" className={styles.actionWarn}>
                    <PauseCircle size={15} />
                    Suspend Caller
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
                    <Ticket size={15} />
                    View Tickets
                  </button>
                  <button type="button" className={styles.action}>
                    <Download size={15} />
                    Export Data
                  </button>
                </div>
              </section>
            </aside>

            <div className={styles.right}>
              <div className={styles.summaryRow}>
                <article className={styles.summaryCard}>
                  <p>Coin Balance</p>
                  <strong>{formatNumber(profile.coins)}</strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>Total Recharge</p>
                  <strong>{formatInr(profile.totalRecharge)}</strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>Calls Made</p>
                  <strong>{profile.calls}</strong>
                </article>
                <article className={styles.summaryCard}>
                  <p>VIP Status</p>
                  <strong>
                    <VipBadge vip={profile.vip} />
                  </strong>
                </article>
              </div>

              <div className={styles.twoCol}>
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Wallet</h2>
                  <dl className={styles.kv}>
                    <div>
                      <dt>Current Balance</dt>
                      <dd>{formatNumber(profile.wallet.currentBalance)}</dd>
                    </div>
                    <div>
                      <dt>Total Coins Purchased</dt>
                      <dd>{formatNumber(profile.wallet.purchased)}</dd>
                    </div>
                    <div>
                      <dt>Total Coins Consumed</dt>
                      <dd>{formatNumber(profile.wallet.consumed)}</dd>
                    </div>
                    <div>
                      <dt>Bonus Coins</dt>
                      <dd>{formatNumber(profile.wallet.bonus)}</dd>
                    </div>
                    <div>
                      <dt>Total Recharge Amount</dt>
                      <dd>{formatInr(profile.wallet.totalRechargeAmount)}</dd>
                    </div>
                  </dl>
                </section>

                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Call Analytics</h2>
                  <dl className={styles.kv}>
                    <div>
                      <dt>Total Calls</dt>
                      <dd>{profile.analytics.totalCalls}</dd>
                    </div>
                    <div>
                      <dt>Completed</dt>
                      <dd>{profile.analytics.completed}</dd>
                    </div>
                    <div>
                      <dt>Missed</dt>
                      <dd>{profile.analytics.missed}</dd>
                    </div>
                    <div>
                      <dt>Cancelled</dt>
                      <dd>{profile.analytics.cancelled}</dd>
                    </div>
                    <div>
                      <dt>Avg Call Duration</dt>
                      <dd>{profile.analytics.avgDuration}</dd>
                    </div>
                    <div>
                      <dt>Total Talk Time</dt>
                      <dd>{profile.analytics.totalTalkTime}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section className={styles.card}>
                <div className={styles.chartHead}>
                  <h2 className={styles.cardTitle}>
                    Call Activity — Last 7 Days
                  </h2>
                </div>
                <CallActivityChart data={profile.weeklyActivity} />
              </section>

              <div className={styles.twoCol}>
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Recent Call History</h2>
                  <div className={styles.miniTableWrap}>
                    <table className={styles.miniTable}>
                      <thead>
                        <tr>
                          <th>Receiver</th>
                          <th>Duration</th>
                          <th>Coins</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.recentCalls.length === 0 ? (
                          <tr>
                            <td colSpan={4}>No call history yet.</td>
                          </tr>
                        ) : null}
                        {profile.recentCalls.map(call => (
                          <tr key={call.id}>
                            <td>{call.receiver}</td>
                            <td>{call.duration}</td>
                            <td>{call.coins}</td>
                            <td>
                              <span
                                className={[
                                  styles.callStatus,
                                  styles[`call_${call.status}`],
                                ].join(' ')}
                              >
                                {call.status}
                              </span>
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
                            styles.dot,
                            styles[`tone_${item.tone}`],
                          ].join(' ')}
                        />
                        <div>
                          <p className={styles.timelineTitle}>{item.title}</p>
                          <p className={styles.timelineDetail}>
                            {item.detail} · {item.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              <div className={styles.moderation}>
                <article className={styles.modCard}>
                  <Ticket size={18} />
                  <div>
                    <p>Tickets Raised</p>
                    <strong>{profile.ticketsRaised}</strong>
                  </div>
                </article>
                <article className={styles.modCard}>
                  <Flag size={18} />
                  <div>
                    <p>Reports Submitted</p>
                    <strong>{profile.reportsSubmitted}</strong>
                  </div>
                </article>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
