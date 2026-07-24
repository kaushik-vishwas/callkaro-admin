import {useMemo, useState} from 'react';
import {CALLER_RANKINGS, formatInr, formatNumber} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Limit = 10 | 50 | 100;

export function CallersTab() {
  const [limit, setLimit] = useState<Limit>(10);
  const rows = useMemo(() => CALLER_RANKINGS.slice(0, Math.min(limit, CALLER_RANKINGS.length)), [limit]);

  return (
    <AnalyticsPanel
      title="Caller Rankings"
      subtitle="Top spenders driving platform revenue"
      actions={
        <div className={styles.segment}>
          {([10, 50, 100] as const).map(value => (
            <button
              key={value}
              type="button"
              className={[
                styles.segmentBtn,
                limit === value ? styles.segmentActive : '',
              ].join(' ')}
              onClick={() => setLimit(value)}
            >
              Top {value}
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
              <th>Caller Name</th>
              <th>Total Spend</th>
              <th>Coins Purchased</th>
              <th>Calls Made</th>
              <th>Talk Time</th>
              <th>Lifetime Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.rank}>
                <td className={styles.rank}>{row.rank}</td>
                <td className={styles.strong}>{row.name}</td>
                <td>{formatInr(row.totalSpend)}</td>
                <td>{formatNumber(row.coinsPurchased)}</td>
                <td>{formatNumber(row.callsMade)}</td>
                <td>{row.talkTime}</td>
                <td>{formatInr(row.lifetimeRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsPanel>
  );
}
