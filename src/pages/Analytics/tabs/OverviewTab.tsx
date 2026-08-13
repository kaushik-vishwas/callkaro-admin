import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/client';
import {
  fetchAnalyticsOverview,
  type ActivityItem,
  type AnalyticsKpi,
  type ChartPoint,
} from '../../../api/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

function LineChart({
  data,
  color = '#8b5cf6',
  fillId,
}: {
  data: Array<{label: string; value: number}>;
  color?: string;
  fillId: string;
}) {
  if (!data.length) {
    return <p className={styles.panelSubtitle}>No chart data yet.</p>;
  }
  const max = Math.max(...data.map(d => d.value), 1);
  const WIDTH = 560;
  const HEIGHT = 200;
  const PAD = {top: 16, right: 12, bottom: 28, left: 12};
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
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.chartSvg} role="img">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${fillId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map(p => (
        <g key={`${p.label}-${p.x}`}>
          <circle cx={p.x} cy={p.y} r="3" fill={color} />
          <text x={p.x} y={HEIGHT - 8} className={styles.chartLabel}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

type Props = {rangeDays: number};

export function OverviewTab({rangeDays}: Props) {
  const [kpis, setKpis] = useState<AnalyticsKpi[]>([]);
  const [revenueSeries, setRevenueSeries] = useState<ChartPoint[]>([]);
  const [userGrowth, setUserGrowth] = useState<ChartPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalyticsOverview(rangeDays);
      setKpis(result.overview.kpis || []);
      setRevenueSeries(result.overview.revenueSeries || []);
      setUserGrowth(result.overview.userGrowth || []);
      setActivity(result.overview.activityFeed || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load overview.',
      );
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className={styles.panelSubtitle}>Loading overview…</p>;
  if (error) return <p className={styles.panelSubtitle}>{error}</p>;

  return (
    <>
      <section className={styles.kpiGrid}>
        {kpis.map(kpi => (
          <article
            key={kpi.id}
            className={[
              styles.kpiCard,
              styles[`tone_${kpi.tone || 'pink'}`],
            ].join(' ')}
          >
            <p className={styles.kpiLabel}>{kpi.label}</p>
            <p className={styles.kpiValue}>
              {kpi.value}
              {kpi.trend === 'up' ? (
                <span className={styles.trendUp}>↑</span>
              ) : null}
            </p>
          </article>
        ))}
      </section>

      <div className={styles.chartsRow}>
        <AnalyticsPanel title="Revenue Analytics">
          <div className={styles.chartWrap}>
            <LineChart data={revenueSeries} color="#ec4899" fillId="revFill" />
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel title="User Growth">
          <div className={styles.chartWrap}>
            <LineChart data={userGrowth} color="#8b5cf6" fillId="growthFill" />
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel title="Live Activity Feed">
          <ul className={styles.activityList}>
            {activity.length === 0 ? (
              <li className={styles.activityItem}>
                <p className={styles.activityText}>No recent activity.</p>
              </li>
            ) : (
              activity.map(item => (
                <li key={item.id} className={styles.activityItem}>
                  <p className={styles.activityText}>{item.text}</p>
                  <p className={styles.activityTime}>{item.time}</p>
                </li>
              ))
            )}
          </ul>
        </AnalyticsPanel>
      </div>
    </>
  );
}
