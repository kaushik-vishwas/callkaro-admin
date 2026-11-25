import {useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import type {RevenuePoint} from '../../../api/dashboard';
import styles from './RevenueChart.module.css';

const HEIGHT = 260;
const PAD = {top: 20, right: 16, bottom: 36, left: 48};

type Props = {
  series: RevenuePoint[];
  actions?: ReactNode;
  loading?: boolean;
};

function formatTick(value: number, max: number) {
  if (max >= 1000) {
    if (value === 0) return '0';
    const k = value / 1000;
    return `${k >= 10 ? Math.round(k) : Number(k.toFixed(1))}k`;
  }
  return String(Math.round(value));
}

export function RevenueChart({series, actions, loading}: Props) {
  // Draw at the card's real pixel width so axis text keeps its 11px size
  // instead of being stretched with the card.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [WIDTH, setWidth] = useState(640);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(Math.max(280, Math.floor(el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
  // Keep the x-axis readable for hourly (24) and 30/90-day series:
  // label roughly 8 evenly spaced points, always including the last one.
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));
  const lastIndex = points.length - 1;
  const showLabel = (index: number) =>
    index === lastIndex ||
    (index % labelEvery === 0 && lastIndex - index >= labelEvery / 2);
  const showDots = points.length <= 31;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Revenue Analytics</h2>
        {actions}
      </div>
      <div
        ref={wrapRef}
        className={`${styles.chartWrap} ${loading ? styles.stale : ''}`}
      >
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

          {showDots && points.map(point => (
            <circle
              key={`${point.day}-${point.date || point.x}`}
              cx={point.x}
              cy={point.y}
              r={3.5}
              className={styles.dot}
            />
          ))}

          {points.filter((_, index) => showLabel(index)).map(point => (
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
