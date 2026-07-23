import {revenueSeries} from '../../../data/dashboard';
import styles from './RevenueChart.module.css';

const WIDTH = 640;
const HEIGHT = 260;
const PAD = {top: 20, right: 16, bottom: 36, left: 48};

export function RevenueChart() {
  const max = 80000;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const points = revenueSeries.map((item, index) => {
    const x =
      PAD.left +
      (index / Math.max(1, revenueSeries.length - 1)) * innerW;
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

  const yTicks = [0, 20000, 40000, 60000, 80000];

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
                  {tick === 0 ? '0' : `${tick / 1000}k`}
                </text>
              </g>
            );
          })}

          <path d={area} className={styles.area} />
          <path d={line} className={styles.line} />

          {points.map(point => (
            <circle
              key={point.day}
              cx={point.x}
              cy={point.y}
              r={3.5}
              className={styles.dot}
            />
          ))}

          {points.map(point => (
            <text
              key={`${point.day}-label`}
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
