import {ChevronDown, FileDown} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {KpiCard} from '../../components/dashboard/KpiCard/KpiCard';
import {RevenueChart} from '../../components/dashboard/RevenueChart/RevenueChart';
import {ActivityFeed} from '../../components/dashboard/ActivityFeed/ActivityFeed';
import {IdealTimeChart} from '../../components/dashboard/IdealTimeChart/IdealTimeChart';
import {
  dashboardKpisBottom,
  dashboardKpisTop,
} from '../../data/dashboard';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
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
            <button type="button" className={styles.rangeBtn}>
              Last 30 Days
              <ChevronDown size={16} strokeWidth={2.25} />
            </button>
            <button type="button" className={styles.exportBtn}>
              <FileDown size={16} strokeWidth={2.25} />
              Export PDF
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          {dashboardKpisTop.map(item => (
            <KpiCard key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.kpiGrid}>
          {dashboardKpisBottom.map(item => (
            <KpiCard key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.midGrid}>
          <RevenueChart />
          <ActivityFeed />
        </div>

        <IdealTimeChart />
      </div>
    </DashboardShell>
  );
}
