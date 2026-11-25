import {useCallback, useEffect, useRef, useState} from 'react';
import {FileDown, RefreshCw} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {KpiCard} from '../../components/dashboard/KpiCard/KpiCard';
import {RevenueChart} from '../../components/dashboard/RevenueChart/RevenueChart';
import {IdealTimeChart} from '../../components/dashboard/IdealTimeChart/IdealTimeChart';
import {RangeFilter} from '../../components/dashboard/RangeFilter/RangeFilter';
import {IdleReceiversProfile} from '../../components/dashboard/IdleReceiversProfile/IdleReceiversProfile';
import {
  fetchDashboard,
  type DashboardData,
  type DashboardRange,
  type DashboardSection,
} from '../../api/dashboard';
import styles from './DashboardPage.module.css';

type FilteredSection = 'kpis' | 'revenue' | 'idle';
type Ranges = Record<FilteredSection, DashboardRange>;

const DEFAULT_RANGES: Ranges = {kpis: 7, revenue: 7, idle: 7};
const ALL_SECTIONS: DashboardSection[] = ['kpis', 'revenue', 'idle'];
export function DashboardPage() {
  const [ranges, setRanges] = useState<Ranges>(DEFAULT_RANGES);
  const [loadingSections, setLoadingSections] = useState<
    Set<DashboardSection>
  >(() => new Set(ALL_SECTIONS));
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  // Latest request id per section, so a slow earlier response never
  // overwrites a newer filter selection.
  const latestReq = useRef<Record<string, number>>({});
  const reqCounter = useRef(0);

  const load = useCallback(
    async (sections: DashboardSection[], nextRanges: Ranges) => {
      const id = ++reqCounter.current;
      sections.forEach(s => {
        latestReq.current[s] = id;
      });
      setLoadingSections(prev => new Set([...prev, ...sections]));
      setError(null);
      try {
        const res = await fetchDashboard({
          kpiDays: nextRanges.kpis,
          revenueDays: nextRanges.revenue,
          idleDays: nextRanges.idle,
          sections,
        });
        const fresh = sections.filter(s => latestReq.current[s] === id);
        if (!fresh.length) return;
        const d = res.dashboard;
        setData(prev => {
          const next = {...(prev || {}), generatedAt: d.generatedAt} as DashboardData;
          if (fresh.includes('kpis')) {
            next.kpiDays = d.kpiDays ?? nextRanges.kpis;
            next.kpisTop = d.kpisTop || [];
            next.kpisBottom = d.kpisBottom || [];
            next.raw = d.raw;
          }
          if (fresh.includes('revenue')) {
            next.revenueDays = d.revenueDays ?? nextRanges.revenue;
            next.revenueSeries = d.revenueSeries || [];
          }
          if (fresh.includes('idle')) {
            next.idleDays = d.idleDays ?? nextRanges.idle;
            next.receiverActivity = d.receiverActivity || [];
            next.callerActivity = d.callerActivity || [];
            next.receiverMaxY = d.receiverMaxY ?? 1;
            next.callerMaxY = d.callerMaxY ?? 0.5;
          }
          return next;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard',
        );
      } finally {
        setLoadingSections(prev => {
          const next = new Set(prev);
          sections.forEach(s => {
            if (latestReq.current[s] === id) next.delete(s);
          });
          return next;
        });
      }
    },
    [],
  );

  useEffect(() => {
    void load(ALL_SECTIONS, DEFAULT_RANGES);
  }, [load]);

  const changeRange = (section: FilteredSection, days: DashboardRange) => {
    const next = {...ranges, [section]: days};
    setRanges(next);
    void load([section], next);
  };

  const refreshAll = () => void load(ALL_SECTIONS, ranges);

  const anyLoading = loadingSections.size > 0;

  return (
    <DashboardShell showSearch={false}>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Real-time oversight of Callkaro&apos;s global ecosystem.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={refreshAll}
              disabled={anyLoading}>
              <RefreshCw size={16} strokeWidth={2.25} />
              {anyLoading ? 'Loading…' : 'Refresh'}
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
            <button type="button" onClick={refreshAll}>
              Retry
            </button>
          </div>
        ) : null}

        {!data && anyLoading ? (
          <p className={styles.loading}>Loading live metrics…</p>
        ) : data ? (
          <>
            <section className={styles.kpiSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                <RangeFilter
                  label="Overview cards date range"
                  value={ranges.kpis}
                  loading={loadingSections.has('kpis')}
                  onChange={days => changeRange('kpis', days)}
                />
              </div>
              <div
                className={`${styles.kpiStack} ${
                  loadingSections.has('kpis') ? styles.stale : ''
                }`}>
                <div className={styles.kpiGrid}>
                  {[
                    ...(data.kpisTop || []),
                    ...(data.kpisBottom || []),
                  ].map(item => (
                    <KpiCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </section>

            <RevenueChart
                series={data.revenueSeries || []}
                loading={loadingSections.has('revenue')}
                actions={
                  <RangeFilter
                    label="Revenue analytics date range"
                    value={ranges.revenue}
                    loading={loadingSections.has('revenue')}
                    onChange={days => changeRange('revenue', days)}
                  />
                }
              />

            <IdealTimeChart
              receiverActivity={data.receiverActivity || []}
              callerActivity={data.callerActivity || []}
              receiverMaxY={data.receiverMaxY ?? 1}
              callerMaxY={data.callerMaxY ?? 0.5}
              loading={loadingSections.has('idle')}
              actions={
                <RangeFilter
                  label="Idle time date range"
                  value={ranges.idle}
                  loading={loadingSections.has('idle')}
                  onChange={days => changeRange('idle', days)}
                />
              }
            />

            <IdleReceiversProfile />
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}
