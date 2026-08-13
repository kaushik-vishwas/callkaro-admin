import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/client';
import {
  fetchAnalyticsNetProfit,
  formatInr,
  type WaterfallItem,
} from '../../../api/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

function WaterfallChart({waterfall}: {waterfall: WaterfallItem[]}) {
  if (!waterfall.length) {
    return <p className={styles.panelSubtitle}>No waterfall data.</p>;
  }
  const WIDTH = 760;
  const HEIGHT = 280;
  const PAD = {top: 24, right: 16, bottom: 40, left: 48};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const max = Math.max(
    ...waterfall.map(item => Math.abs(item.value)),
    waterfall.find(item => item.kind === 'start')?.value || 1,
    1,
  );
  const barW = innerW / waterfall.length / 1.6;

  let running = 0;
  const bars = waterfall.map((item, index) => {
    const x =
      PAD.left +
      (index + 0.5) * (innerW / waterfall.length) -
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

type Props = {rangeDays: number};

export function NetProfitTab({rangeDays}: Props) {
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [netMargin, setNetMargin] = useState('0.0%');
  const [waterfall, setWaterfall] = useState<WaterfallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalyticsNetProfit(rangeDays);
      const data = result.netProfit;
      setGrossRevenue(data.grossRevenue || 0);
      setTotalDeductions(data.totalDeductions || 0);
      setNetRevenue(data.netRevenue || 0);
      setNetMargin(data.netMargin || '0.0%');
      setWaterfall(data.waterfall || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load net profit.',
      );
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className={styles.panelSubtitle}>Loading net profit…</p>;
  }
  if (error) {
    return <p className={styles.panelSubtitle}>{error}</p>;
  }

  return (
    <AnalyticsPanel
      title="Net Profit Analytics"
      subtitle="Revenue after all deductions — true platform profit."
    >
      <div className={styles.netKpis}>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Gross Revenue</p>
          <p className={styles.netKpiValue}>{formatInr(grossRevenue)}</p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Total Deductions</p>
          <p className={styles.netKpiValue}>{formatInr(totalDeductions)}</p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Net Revenue</p>
          <p className={styles.netKpiValue}>{formatInr(netRevenue)}</p>
        </article>
        <article className={styles.netKpi}>
          <p className={styles.netKpiLabel}>Net Margin</p>
          <p className={styles.netKpiValue}>{netMargin}</p>
        </article>
      </div>

      <div
        className={styles.panelHead}
        style={{borderTop: '1px solid var(--color-border)'}}
      >
        <h3 className={styles.panelTitle}>
          Revenue Waterfall — Deduction Breakdown
        </h3>
      </div>
      <div className={styles.chartWrap}>
        <WaterfallChart waterfall={waterfall} />
      </div>
      <div className={styles.waterfallLabels}>
        {waterfall.map(item => (
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
