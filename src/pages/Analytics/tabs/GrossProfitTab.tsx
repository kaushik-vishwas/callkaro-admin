import {formatInr, GROSS_PROFIT} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

function DonutChart() {
  const size = 220;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={styles.chartSvg}
      role="img"
      aria-label="Revenue split"
      style={{maxWidth: 240, margin: '0 auto', display: 'block', padding: 16}}
    >
      {GROSS_PROFIT.split.map(slice => {
        const length = (slice.percent / 100) * circumference;
        const el = (
          <circle
            key={slice.id}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={stroke}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += length;
        return el;
      })}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        style={{fontSize: 12, fill: '#6b7280', fontWeight: 700}}
      >
        Split
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        style={{fontSize: 16, fill: '#111827', fontWeight: 800}}
      >
        100%
      </text>
    </svg>
  );
}

function StackedBarChart() {
  const WIDTH = 640;
  const HEIGHT = 260;
  const PAD = {top: 20, right: 16, bottom: 36, left: 48};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const max = Math.max(
    ...GROSS_PROFIT.monthly.map(m => m.platform + m.receiver + m.agent),
    1,
  );
  const barW = innerW / GROSS_PROFIT.monthly.length / 1.8;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.chartSvg} role="img">
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = PAD.top + innerH - t * innerH;
        return (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={PAD.left + innerW}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text x={PAD.left - 8} y={y + 3} textAnchor="end" className={styles.axisLabel}>
              ₹{Math.round((max * t) / 1000)}K
            </text>
          </g>
        );
      })}
      {GROSS_PROFIT.monthly.map((month, index) => {
        const x =
          PAD.left +
          (index + 0.5) * (innerW / GROSS_PROFIT.monthly.length) -
          barW / 2;
        const hPlatform = (month.platform / max) * innerH;
        const hReceiver = (month.receiver / max) * innerH;
        const hAgent = (month.agent / max) * innerH;
        const yAgent = PAD.top + innerH - hAgent;
        const yReceiver = yAgent - hReceiver;
        const yPlatform = yReceiver - hPlatform;
        return (
          <g key={month.label}>
            <rect x={x} y={yPlatform} width={barW} height={hPlatform} fill="#1e3a8a" rx={2} />
            <rect x={x} y={yReceiver} width={barW} height={hReceiver} fill="#ec4899" />
            <rect x={x} y={yAgent} width={barW} height={hAgent} fill="#f59e0b" rx={2} />
            <text
              x={x + barW / 2}
              y={HEIGHT - 12}
              className={styles.chartLabel}
            >
              {month.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function GrossProfitTab() {
  return (
    <>
      <div className={styles.grossTop}>
        <article className={styles.grossBig}>
          <p className={styles.grossBigLabel}>Total Gross Revenue</p>
          <p className={styles.grossBigValue}>
            {formatInr(GROSS_PROFIT.totalGrossRevenue)}
          </p>
        </article>
        <article className={styles.grossBig}>
          <p className={styles.grossBigLabel}>Net Platform Share</p>
          <p className={styles.grossBigValue}>
            {formatInr(GROSS_PROFIT.netPlatformShare)}
          </p>
        </article>
      </div>

      <div className={styles.grossCharts}>
        <AnalyticsPanel title="Revenue Split">
          <DonutChart />
          <ul className={styles.legend}>
            {GROSS_PROFIT.split.map(slice => (
              <li key={slice.id} className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span
                    className={styles.swatch}
                    style={{background: slice.color}}
                  />
                  {slice.label} ({slice.percent}%)
                </span>
                <span className={styles.strong}>{formatInr(slice.amount)}</span>
              </li>
            ))}
          </ul>
        </AnalyticsPanel>

        <AnalyticsPanel title="Gross Profit Stacked Bar">
          <div className={styles.chartWrap}>
            <StackedBarChart />
          </div>
        </AnalyticsPanel>
      </div>
    </>
  );
}
