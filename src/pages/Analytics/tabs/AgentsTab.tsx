import {useState} from 'react';
import {
  AGENT_BREAKDOWN,
  AGENT_RANKINGS,
  formatInr,
  formatNumber,
} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Period = 'monthly' | 'quarterly' | 'yearly';

export function AgentsTab() {
  const [period, setPeriod] = useState<Period>('monthly');
  const totalCommission = AGENT_BREAKDOWN.reduce(
    (sum, row) => sum + row.commission,
    0,
  );

  return (
    <div className={styles.agentsLayout}>
      <AnalyticsPanel
        title="Top Agents Leaderboard"
        actions={
          <div className={styles.segment}>
            {(
              [
                ['monthly', 'Monthly'],
                ['quarterly', 'Quarterly'],
                ['yearly', 'Yearly'],
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
                <th>Agent</th>
                <th>Receivers</th>
                <th>Revenue Generated</th>
                <th>Total Commission</th>
                <th>Avg Receiver Revenue</th>
                <th>Growth %</th>
              </tr>
            </thead>
            <tbody>
              {AGENT_RANKINGS.map(row => (
                <tr key={row.rank}>
                  <td className={styles.rank}>{row.rank}</td>
                  <td className={styles.strong}>{row.name}</td>
                  <td>{formatNumber(row.receivers)}</td>
                  <td>{formatInr(row.revenue)}</td>
                  <td>{formatInr(row.commission)}</td>
                  <td>{formatInr(row.avgReceiverRevenue)}</td>
                  <td className={styles.growthPos}>+{row.growth}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnalyticsPanel>

      <AnalyticsPanel title="Agent Revenue Breakdown">
        <div className={styles.breakdownList}>
          {AGENT_BREAKDOWN.map(row => (
            <div key={row.name} className={styles.breakdownRow}>
              <div>
                <p className={styles.strong} style={{margin: 0}}>
                  {row.name}
                </p>
                <p className={styles.breakdownMeta} style={{margin: '4px 0 0'}}>
                  Revenue {formatInr(row.revenue)}
                </p>
              </div>
              <div className={styles.strong}>{formatInr(row.commission)}</div>
            </div>
          ))}
        </div>
        <div className={styles.commissionBar}>
          <span>Total Commission</span>
          <span>{formatInr(totalCommission)}</span>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
