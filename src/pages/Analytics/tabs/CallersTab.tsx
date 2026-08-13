import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/client';
import {
  fetchAnalyticsCallers,
  formatInr,
  formatNumber,
  type CallerRanking,
} from '../../../api/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Limit = 10 | 50 | 100;
type Props = {rangeDays: number};

export function CallersTab({rangeDays}: Props) {
  const [limit, setLimit] = useState<Limit>(10);
  const [rows, setRows] = useState<CallerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalyticsCallers(limit, rangeDays);
      setRows(result.rankings || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load callers.',
      );
    } finally {
      setLoading(false);
    }
  }, [limit, rangeDays]);

  useEffect(() => {
    void load();
  }, [load]);

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
      {loading ? <p className={styles.panelSubtitle}>Loading rankings…</p> : null}
      {error ? <p className={styles.panelSubtitle}>{error}</p> : null}
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
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.panelSubtitle}>
                  No caller spend in this range.
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={`${row.rank}-${row.name}`}>
                  <td className={styles.rank}>{row.rank}</td>
                  <td className={styles.strong}>{row.name}</td>
                  <td>{formatInr(row.totalSpend)}</td>
                  <td>{formatNumber(row.coinsPurchased)}</td>
                  <td>{formatNumber(row.callsMade)}</td>
                  <td>{row.talkTime}</td>
                  <td>{formatInr(row.lifetimeRevenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AnalyticsPanel>
  );
}
