import {formatInr, NET_PROFIT} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

function WaterfallChart() {
  const WIDTH = 760;
  const HEIGHT = 280;
  const PAD = {top: 24, right: 16, bottom: 40, left: 48};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const max = 1000000;
  const barW = innerW / NET_PROFIT.waterfall.length / 1.6;

  let running = 0;
  const bars = NET_PROFIT.waterfall.map((item, index) => {
    const x =
      PAD.left +
      (index + 0.5) * (innerW / NET_PROFIT.waterfall.length) -
      barW / 2;
    let y = 0;
    let h = 0;
    if (item.kind === 'start' || item.kind === 'end') {
      h = (Math.abs(item.value) / max) * innerH;
      y = PAD.top + innerH - h;
      running = item.value;
    } else {
      const prev = running;
      running += item.value;
      const top = Math.max(prev, running);
      const bottom = Math.min(prev, running);
      h = ((top - bottom) / max) * innerH;
      y = PAD.top + innerH - (top / max) * innerH;
    }
    return {...item, x, y, h};
  });

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
      {bars.map(bar => (
        <g key={bar.id}>
          <rect
            x={bar.x}
            y={bar.y}
            width={barW}
            height={Math.max(2, bar.h)}
            fill={bar.color}
            rx={4}
          />
          <text x={bar.x + barW / 2} y={HEIGHT - 12} className={styles.chartLabel}>
            {bar.label.split(' ')[0]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function NetProfitTab() {
  return (
    <AnalyticsPanel
      title="Net Profit Analytics"
      subtitle="Revenue after all deductions — true platform profit."
    >
      <div className={styles.netKpis}>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Gross Revenue</p>
          <p className={styles.netKpiValue}>
            {formatInr(NET_PROFIT.grossRevenue)}
          </p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Total Deductions</p>
          <p className={styles.netKpiValue}>
            {formatInr(NET_PROFIT.totalDeductions)}
          </p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Net Revenue</p>
          <p className={styles.netKpiValue}>
            {formatInr(NET_PROFIT.netRevenue)}
          </p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Net Margin</p>
          <p className={styles.netKpiValue}>{NET_PROFIT.netMargin}</p>
        </article>
      </div>

      <div className={styles.panelHead} style={{borderTop: '1px solid var(--color-border)'}}>
        <h3 className={styles.panelTitle}>Revenue Waterfall — Deduction Breakdown</h3>
      </div>
      <div className={styles.chartWrap}>
        <WaterfallChart />
      </div>
      <div className={styles.waterfallLabels}>
        {NET_PROFIT.waterfall.map(item => (
          <div
            key={item.id}
            className={
              item.value < 0 ? styles.waterfallNeg : styles.waterfallPos
            }
          >
            {item.value < 0
              ? `-${formatInr(Math.abs(item.value))}`
              : formatInr(item.value)}
          </div>
        ))}
      </div>
    </AnalyticsPanel>
  );
}
