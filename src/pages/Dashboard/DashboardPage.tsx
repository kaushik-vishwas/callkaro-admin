import {useCallback, useEffect, useState} from 'react';
import {ChevronDown, FileDown, RefreshCw} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {KpiCard} from '../../components/dashboard/KpiCard/KpiCard';
import {RevenueChart} from '../../components/dashboard/RevenueChart/RevenueChart';
import {ActivityFeed} from '../../components/dashboard/ActivityFeed/ActivityFeed';
import {IdealTimeChart} from '../../components/dashboard/IdealTimeChart/IdealTimeChart';
import {
  fetchDashboard,
  type DashboardData,
} from '../../api/dashboard';
import styles from './DashboardPage.module.css';

const RANGES = [
  {days: 7, label: 'Last 7 Days'},
  {days: 30, label: 'Last 30 Days'},
  {days: 90, label: 'Last 90 Days'},
] as const;

export function DashboardPage() {
  const [rangeDays, setRangeDays] = useState(30);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard(rangeDays);
      setData(res.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    void load();
  }, [load]);

  const rangeLabel =
    RANGES.find(r => r.days === rangeDays)?.label || 'Last 30 Days';

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Enterprise Dashboard</h1>
            <p className={styles.subtitle}>
              Real-time oversight of Callkaro&apos;s global ecosystem.
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.rangeWrap}>
              <button
                type="button"
                className={styles.rangeBtn}
                onClick={() => setRangeOpen(v => !v)}>
                {rangeLabel}
                <ChevronDown size={16} strokeWidth={2.25} />
              </button>
              {rangeOpen ? (
                <div className={styles.rangeMenu}>
                  {RANGES.map(item => (
                    <button
                      key={item.days}
                      type="button"
                      className={styles.rangeItem}
                      onClick={() => {
                        setRangeDays(item.days);
                        setRangeOpen(false);
                      }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => void load()}
              disabled={loading}>
              <RefreshCw size={16} strokeWidth={2.25} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button type="button" className={styles.exportBtn} disabled>
              <FileDown size={16} strokeWidth={2.25} />
              Export PDF
            </button>
          </div>
        </div>

        {error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button type="button" onClick={() => void load()}>
              Retry
            </button>
          </div>
        ) : null}

        {loading && !data ? (
          <p className={styles.loading}>Loading live metrics…</p>
        ) : data ? (
          <>
            <div className={styles.kpiGrid}>
              {data.kpisTop.map(item => (
                <KpiCard key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.kpiGrid}>
              {data.kpisBottom.map(item => (
                <KpiCard key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.midGrid}>
              <RevenueChart series={data.revenueSeries} />
              <ActivityFeed items={data.activityFeed} />
            </div>

            <IdealTimeChart
              receiverActivity={data.receiverActivity}
              callerActivity={data.callerActivity}
              receiverMaxY={data.receiverMaxY}
              callerMaxY={data.callerMaxY}
            />
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}
