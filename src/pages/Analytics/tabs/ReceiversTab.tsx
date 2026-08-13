import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/client';
import {
  fetchAnalyticsReceivers,
  formatInr,
  formatNumber,
  type ReceiverRanking,
} from '../../../api/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Period = 'daily' | 'weekly' | 'monthly' | 'lifetime';
type Props = {rangeDays: number};

export function ReceiversTab({rangeDays}: Props) {
  const [period, setPeriod] = useState<Period>('monthly');
  const [rows, setRows] = useState<ReceiverRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep local period in sync when global range changes (map to closest bucket).
  useEffect(() => {
    if (rangeDays <= 1) setPeriod('daily');
    else if (rangeDays <= 7) setPeriod('weekly');
    else if (rangeDays <= 90) setPeriod('monthly');
    else setPeriod('lifetime');
  }, [rangeDays]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalyticsReceivers(period, 50);
      setRows(result.rankings || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load receivers.',
      );
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

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
      {loading ? <p className={styles.panelSubtitle}>Loading rankings…</p> : null}
      {error ? <p className={styles.panelSubtitle}>{error}</p> : null}
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
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.panelSubtitle}>
                  No receiver activity for this period.
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={`${row.rank}-${row.name}`}>
                  <td className={styles.rank}>{row.rank}</td>
                  <td className={styles.strong}>{row.name}</td>
                  <td>{formatNumber(row.callsHandled)}</td>
                  <td>{formatNumber(row.coinsEarned)}</td>
                  <td>{formatInr(row.revenue)}</td>
                  <td>{row.onlineTime}</td>
                  <td>{row.idleTime}</td>
                  <td>{row.utilization}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AnalyticsPanel>
  );
}
