import type {RevenuePoint} from '../../../api/dashboard';
import styles from './RevenueChart.module.css';

const WIDTH = 640;
const HEIGHT = 260;
const PAD = {top: 20, right: 16, bottom: 36, left: 48};

type Props = {
  series: RevenuePoint[];
};

function formatTick(value: number, max: number) {
  if (max >= 1000) {
    return value === 0 ? '0' : `${Math.round(value / 1000)}k`;
  }
  return String(Math.round(value));
}

export function RevenueChart({series}: Props) {
  const safeSeries =
    series?.length > 0
      ? series
      : [{day: '—', value: 0}];
  const maxRaw = Math.max(...safeSeries.map(item => item.value), 0);
  const max = maxRaw > 0 ? maxRaw * 1.15 : 1000;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const points = safeSeries.map((item, index) => {
    const x =
      PAD.left +
      (index / Math.max(1, safeSeries.length - 1)) * innerW;
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

  const yTicks = [0, max / 4, max / 2, (max * 3) / 4, max];

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Revenue Analytics</h2>
      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={styles.svg}
          role="img"
          aria-label="Revenue analytics line chart"
        >
          {yTicks.map(tick => {
            const y = PAD.top + innerH - (tick / max) * innerH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  className={styles.grid}
                />
                <text x={PAD.left - 10} y={y + 4} className={styles.axis}>
                  {formatTick(tick, max)}
                </text>
              </g>
            );
          })}

          <path d={area} className={styles.area} />
          <path d={line} className={styles.line} />

          {points.map(point => (
            <circle
              key={`${point.day}-${point.date || point.x}`}
              cx={point.x}
              cy={point.y}
              r={3.5}
              className={styles.dot}
            />
          ))}

          {points.map(point => (
            <text
              key={`${point.day}-label-${point.date || point.x}`}
              x={point.x}
              y={HEIGHT - 12}
              className={styles.xLabel}
            >
              {point.day}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
