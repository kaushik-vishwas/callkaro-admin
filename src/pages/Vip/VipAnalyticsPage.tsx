import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Pencil, Search, Trash2} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {
  formatInr,
  formatNumber,
  VIP_ANALYTICS,
  VIP_TOP_USERS,
  type VipPeriod,
} from '../../data/vip';
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

export function VipAnalyticsPage() {
  const [period, setPeriod] = useState<VipPeriod>('monthly');
  const [query, setQuery] = useState('');

  const chartData = useMemo(() => {
    if (period === 'weekly') return VIP_ANALYTICS.chartWeekly;
    if (period === 'yearly') return VIP_ANALYTICS.chartYearly;
    return VIP_ANALYTICS.chartMonthly;
  }, [period]);

  const topUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VIP_TOP_USERS;
    return VIP_TOP_USERS.filter(
      user =>
        user.name.toLowerCase().includes(q) ||
        user.userId.toLowerCase().includes(q),
    );
  }, [query]);

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

        <section className={styles.statGrid}>
          <StatCard
            label="VIP Revenue"
            value={VIP_ANALYTICS.revenueLabel}
            tone="purple"
          />
          <StatCard
            label="Active VIP Users"
            value={formatNumber(VIP_ANALYTICS.activeVipUsers)}
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
            <RevenueChart data={chartData} />
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
                {topUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No users match your search.
                    </td>
                  </tr>
                ) : null}
                {topUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatar}>
                          {user.name.slice(0, 1)}
                        </span>
                        <span className={styles.strong}>{user.name}</span>
                      </div>
                    </td>
                    <td className={styles.code}>{user.userId}</td>
                    <td>{formatInr(user.amountSpent)}</td>
                    <td>{formatNumber(user.totalCalls)}</td>
                    <td>
                      <div className={styles.statusRow}>
                        <span className={styles.statusActive}>Active</span>
                        <button type="button" className={styles.iconBtn} aria-label="Edit">
                          <Pencil size={14} />
                        </button>
                        <button type="button" className={styles.iconBtn} aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
