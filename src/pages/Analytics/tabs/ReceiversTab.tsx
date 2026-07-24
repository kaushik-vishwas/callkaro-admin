import {useState} from 'react';
import {
  formatInr,
  formatNumber,
  RECEIVER_RANKINGS,
} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Period = 'daily' | 'weekly' | 'monthly' | 'lifetime';

export function ReceiversTab() {
  const [period, setPeriod] = useState<Period>('daily');

  return (
    <AnalyticsPanel
      title="Receiver Rankings"
      subtitle="Top performers by earnings and utilization"
      actions={
        <div className={styles.segment}>
          {(
            [
              ['daily', 'Daily'],
              ['weekly', 'Weekly'],
              ['monthly', 'Monthly'],
              ['lifetime', 'Lifetime'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={[
                styles.segmentBtn,
                period === id ? styles.segmentActive : '',
              ].join(' ')}
              onClick={() => setPeriod(id)}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Receiver</th>
              <th>Calls Handled</th>
              <th>Coins Earned</th>
              <th>Revenue Generated</th>
              <th>Online Time</th>
              <th>Idle Time</th>
              <th>Utilization %</th>
            </tr>
          </thead>
          <tbody>
            {RECEIVER_RANKINGS.map(row => (
              <tr key={row.rank}>
                <td className={styles.rank}>{row.rank}</td>
                <td className={styles.strong}>{row.name}</td>
                <td>{formatNumber(row.callsHandled)}</td>
                <td>{formatNumber(row.coinsEarned)}</td>
                <td>{formatInr(row.revenue)}</td>
                <td>{row.onlineTime}</td>
                <td>{row.idleTime}</td>
                <td>{row.utilization}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsPanel>
  );
}
