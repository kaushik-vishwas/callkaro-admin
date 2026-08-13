import {useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  MapPin,
  PauseCircle,
  Pencil,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchVipUser,
  formatInr,
  formatNumber,
  type VipUser,
} from '../../api/vip';
import styles from './VipUserDetailPage.module.css';

export function VipUserDetailPage() {
  const {userId = ''} = useParams();
  const [user, setUser] = useState<VipUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchVipUser(userId)
      .then(result => {
        if (cancelled) return;
        setUser(result.user);
      })
      .catch(err => {
        if (cancelled) return;
        if (err instanceof ApiError && err.statusCode === 404) {
          setNotFound(true);
          return;
        }
        setError(
          err instanceof ApiError ? err.message : 'Failed to load VIP user.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (notFound) {
    return <Navigate to="/vip/users" replace />;
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className={styles.page}>
          <EmptyTableState label="Loading VIP user..." />
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <div className={styles.page}>
          <p>{error || 'VIP user not found.'}</p>
          <Link to="/vip/users" className={styles.back}>
            Back to VIP Users
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.topBar}>
          <Link to="/vip/users" className={styles.back}>
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to VIP Users
          </Link>
          <Link to={`/callers/${user.id}`} className={styles.profileLink}>
            View User Profile
          </Link>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <span className={styles.avatar}>{user.name.slice(0, 1)}</span>
            <div>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{user.name}</h1>
                <span className={styles.accountActive}>
                  {user.status === 'active' ? 'Active Account' : user.status}
                </span>
              </div>
              <p className={styles.meta}>
                {user.code} · Joined {user.joinDate} · {user.vipPlan}
              </p>
              <p className={styles.location}>
                <MapPin size={14} />
                {user.location || '—'}
              </p>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button type="button" className={styles.suspendBtn}>
              <PauseCircle size={15} />
              Suspend (24 Hrs)
            </button>
            <button type="button" className={styles.terminateBtn}>
              <Ban size={15} />
              Terminate
            </button>
          </div>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2>User Details</h2>
              <button type="button" className={styles.editLink}>
                <Pencil size={13} />
                Edit
              </button>
            </div>
            <dl className={styles.kv}>
              <div>
                <dt>Full Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt>Mobile Number</dt>
                <dd>{user.phone || '—'}</dd>
              </div>
              <div>
                <dt>Email Address</dt>
                <dd>{user.email || '—'}</dd>
              </div>
              <div>
                <dt>VIP Plan</dt>
                <dd>{user.vipPlan || '—'}</dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>
                  {user.vipExpiresAt
                    ? new Date(user.vipExpiresAt).toLocaleDateString('en-GB')
                    : '—'}
                </dd>
              </div>
            </dl>
          </section>

          <div className={styles.rightCol}>
            <section className={styles.balanceCard}>
              <p className={styles.balanceLabel}>Current Balance</p>
              <p className={styles.balanceValue}>{formatInr(user.balance)}</p>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Recent Wallet Actions</h2>
              </div>
              <dl className={styles.kv}>
                <div>
                  <dt>Last Recharge</dt>
                  <dd>{user.lastRecharge}</dd>
                </div>
                <div>
                  <dt>Last Withdrawal</dt>
                  <dd>{user.lastWithdrawal}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2>Call Activity Summary</h2>
          </div>
          <div className={styles.miniStats}>
            <div>
              <p className={styles.miniLabel}>Total Calls</p>
              <p className={styles.miniValue}>
                {formatNumber(user.callSummary.totalCalls)}
              </p>
            </div>
            <div>
              <p className={styles.miniLabel}>Total Mins</p>
              <p className={styles.miniValue}>
                {formatNumber(user.callSummary.totalMins)}
              </p>
            </div>
            <div>
              <p className={styles.miniLabel}>Coins Spent</p>
              <p className={styles.miniValue}>
                {formatNumber(user.callSummary.coinsSpent)}
              </p>
            </div>
            <div>
              <p className={styles.miniLabel}>Level</p>
              <p className={styles.miniValue}>{user.callSummary.level}</p>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Call Type</th>
                  <th>Duration</th>
                  <th>Coins</th>
                  <th>Date / Time</th>
                </tr>
              </thead>
              <tbody>
                {user.recentCalls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No recent calls.
                    </td>
                  </tr>
                ) : (
                  user.recentCalls.map(call => (
                    <tr key={call.id}>
                      <td className={styles.strong}>{call.name}</td>
                      <td>
                        <span className={styles.typeChip}>{call.callType}</span>
                      </td>
                      <td>{call.duration}</td>
                      <td>{formatNumber(call.coins)}</td>
                      <td>{call.dateTime}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className={styles.bottomGrid}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Call Activity Stats</h2>
            <div className={styles.miniStats}>
              <div>
                <p className={styles.miniLabel}>Total Calls</p>
                <p className={styles.miniValue}>
                  {formatNumber(user.activityStats.totalCalls)}
                </p>
              </div>
              <div>
                <p className={styles.miniLabel}>Completed Calls</p>
                <p className={styles.miniValue}>
                  {formatNumber(user.activityStats.vipCalls)}
                </p>
              </div>
              <div>
                <p className={styles.miniLabel}>Coins Spent</p>
                <p className={styles.miniValue}>
                  {formatNumber(user.activityStats.coinsSpent)}
                </p>
              </div>
              <div>
                <p className={styles.miniLabel}>Avg. Duration</p>
                <p className={styles.miniValue}>
                  {user.activityStats.avgDuration}
                </p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2>Transaction History</h2>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={styles.empty}>
                        No transactions yet.
                      </td>
                    </tr>
                  ) : (
                    user.transactions.map(tx => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td>{tx.type}</td>
                        <td>{formatInr(tx.amount)}</td>
                        <td>
                          <span className={styles.txSuccess}>
                            {tx.status === 'success' ? 'Success' : tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
