import {
  callerActivity,
  receiverActivity,
  type HourBucket,
} from '../../../data/dashboard';
import styles from './IdealTimeChart.module.css';

function GroupedBars({
  title,
  data,
  maxY,
  ySuffix = 'h',
}: {
  title: string;
  data: HourBucket[];
  maxY: number;
  ySuffix?: string;
}) {
  const WIDTH = 480;
  const HEIGHT = 220;
  const PAD = {top: 16, right: 8, bottom: 28, left: 36};
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const groupW = innerW / data.length;
  const barW = Math.min(8, groupW / 4.2);

  const yTicks = [0, maxY / 2, maxY];

  return (
    <div className={styles.chartBlock}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label={title}
      >
        {yTicks.map(tick => {
          const y = PAD.top + innerH - (tick / maxY) * innerH;
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                className={styles.grid}
              />
              <text x={PAD.left - 8} y={y + 3} className={styles.axis}>
                {tick}
                {ySuffix}
              </text>
            </g>
          );
        })}

        {data.map((bucket, index) => {
          const cx = PAD.left + index * groupW + groupW / 2;
          const metrics = [
            {key: 'call', value: bucket.call, className: styles.call},
            {key: 'online', value: bucket.online, className: styles.online},
            {key: 'idle', value: bucket.idle, className: styles.idle},
          ];

          return (
            <g key={bucket.hour}>
              {metrics.map((metric, mIndex) => {
                const h = (metric.value / maxY) * innerH;
                const x = cx - (barW * 1.6) + mIndex * (barW + 2);
                const y = PAD.top + innerH - h;
                return (
                  <rect
                    key={metric.key}
                    x={x}
                    y={y}
                    width={barW}
                    height={Math.max(1, h)}
                    rx={2}
                    className={metric.className}
                  />
                );
              })}
              {index % 2 === 0 ? (
                <text x={cx} y={HEIGHT - 8} className={styles.xLabel}>
                  {bucket.hour}h
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function IdealTimeChart() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Callers vs Receivers Ideal Time</h2>
        <div className={styles.legend}>
          <span>
            <i className={styles.swatchCall} /> Call Time
          </span>
          <span>
            <i className={styles.swatchOnline} /> Online/App Time
          </span>
          <span>
            <i className={styles.swatchIdle} /> Idle Time
          </span>
        </div>
      </div>

      <div className={styles.charts}>
        <GroupedBars
          title="Receiver Activity"
          data={receiverActivity}
          maxY={16}
        />
        <GroupedBars title="Caller Activity" data={callerActivity} maxY={2} />
      </div>

      <div className={styles.footer}>
        <p>
          <strong>Receiver Idle</strong> = Online Time − Call Time
        </p>
        <p>
          <strong>Caller Idle</strong> = App Usage − Call Time
        </p>
        <p>
          <strong>Utilization %</strong> = Call Time / Online Time
        </p>
      </div>
    </section>
  );
}
