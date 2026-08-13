import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchVipAnalytics,
  formatInr,
  formatNumber,
  type VipAnalytics,
  type VipPeriod,
  type VipTopUser,
} from '../../api/vip';
import styles from './VipAnalyticsPage.module.css';

function RevenueChart({
  data,
}: {
  data: Array<{label: string; value: number}>;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const WIDTH = 720;
  const HEIGHT = 240;
  const PAD = {top: 20, right: 16, bottom: 32, left: 16};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const points = data.map((item, index) => {
    const x = PAD.left + (index / Math.max(data.length - 1, 1)) * innerW;
    const y = PAD.top + innerH - (item.value / max) * innerH;
    return {x, y, ...item};
  });

  const line = points.map(p => `${p.x},${p.y}`).join(' ');
  const area = [
    `${PAD.left},${PAD.top + innerH}`,
    ...points.map(p => `${p.x},${p.y}`),
    `${PAD.left + innerW},${PAD.top + innerH}`,
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={styles.chartSvg}
      role="img"
      aria-label="VIP revenue chart"
    >
      <defs>
        <linearGradient id="vipRevenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#vipRevenueFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map(point => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="3.5" fill="#8b5cf6" />
          <text x={point.x} y={HEIGHT - 10} className={styles.chartLabel}>
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

const EMPTY_ANALYTICS: VipAnalytics = {
  revenue: 0,
  revenueLabel: '₹ 0',
  activeVipUsers: 0,
  chart: [],
  topUsers: [],
};

export function VipAnalyticsPage() {
  const [period, setPeriod] = useState<VipPeriod>('monthly');
  const [query, setQuery] = useState('');
  const [analytics, setAnalytics] = useState<VipAnalytics>(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchVipAnalytics(period)
      .then(result => {
        if (cancelled) return;
        setAnalytics(result.analytics || EMPTY_ANALYTICS);
      })
      .catch(err => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load VIP analytics.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const topUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = analytics.topUsers || [];
    if (!q) return rows;
    return rows.filter(
      (user: VipTopUser) =>
        user.name.toLowerCase().includes(q) ||
        user.userId.toLowerCase().includes(q),
    );
  }, [query, analytics.topUsers]);

  const chartData = analytics.chart?.length
    ? analytics.chart
    : [{label: '—', value: 0}];

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>VIP Revenue & Analytics</h1>
            <p className={styles.subtitle}>
              Real-time performance metrics for premium tier users.
            </p>
          </div>
          <VipSubnav />
        </header>

        <div className={styles.controls}>
          <label className={styles.search}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search users by name, ID or mobile..."
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </label>
          <div className={styles.period}>
            {(
              [
                ['weekly', 'Weekly'],
                ['monthly', 'Monthly'],
                ['yearly', 'Yearly'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={[
                  styles.periodBtn,
                  period === id ? styles.periodActive : '',
                ].join(' ')}
                onClick={() => setPeriod(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className={styles.subtitle}>{error}</p> : null}

        <section className={styles.statGrid}>
          <StatCard
            label="VIP Revenue"
            value={analytics.revenueLabel}
            tone="purple"
          />
          <StatCard
            label="Active VIP Users"
            value={formatNumber(analytics.activeVipUsers)}
            tone="pink"
          />
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2>
              {period === 'weekly'
                ? 'Weekly VIP Revenue'
                : period === 'yearly'
                  ? 'Yearly VIP Revenue'
                  : 'Monthly VIP Revenue'}
            </h2>
          </div>
          <div className={styles.chartWrap}>
            {loading ? (
              <EmptyTableState label="Loading chart..." />
            ) : (
              <RevenueChart data={chartData} />
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2>Top VIP Users</h2>
            <Link to="/vip/users" className={styles.viewAll}>
              View All
            </Link>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>Amount Spent</th>
                  <th>Total Calls</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      <EmptyTableState label="Loading users..." />
                    </td>
                  </tr>
                ) : topUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No VIP spenders yet.
                    </td>
                  </tr>
                ) : (
                  topUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <Link
                          to={`/vip/users/${user.id}`}
                          className={styles.userCell}
                        >
                          <span className={styles.avatar}>
                            {user.name.slice(0, 1)}
                          </span>
                          <span className={styles.strong}>{user.name}</span>
                        </Link>
                      </td>
                      <td className={styles.code}>{user.userId}</td>
                      <td>{formatInr(user.amountSpent)}</td>
                      <td>{formatNumber(user.totalCalls)}</td>
                      <td>
                        <span className={styles.statusActive}>
                          {String(user.status || 'active').toUpperCase()}
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
    </DashboardShell>
  );
}
