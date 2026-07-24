import {
  LIVE_ACTIVITY,
  OVERVIEW_KPIS,
  REVENUE_WEEK,
  USER_GROWTH,
} from '../../../data/analytics';
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
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="3" fill={color} />
          <text x={p.x} y={HEIGHT - 8} className={styles.chartLabel}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function OverviewTab() {
  return (
    <>
      <section className={styles.kpiGrid}>
        {OVERVIEW_KPIS.map(kpi => (
          <article
            key={kpi.id}
            className={[styles.kpiCard, styles[`tone_${kpi.tone}`]].join(' ')}
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
            <LineChart data={REVENUE_WEEK} color="#ec4899" fillId="revFill" />
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel title="User Growth">
          <div className={styles.chartWrap}>
            <LineChart data={USER_GROWTH} color="#8b5cf6" fillId="growthFill" />
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel title="Live Activity Feed">
          <ul className={styles.activityList}>
            {LIVE_ACTIVITY.map(item => (
              <li key={item.id} className={styles.activityItem}>
                <p className={styles.activityText}>{item.text}</p>
                <p className={styles.activityTime}>{item.time}</p>
              </li>
            ))}
          </ul>
        </AnalyticsPanel>
      </div>
    </>
  );
}
