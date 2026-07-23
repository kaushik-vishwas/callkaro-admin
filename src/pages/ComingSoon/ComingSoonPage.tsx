import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import styles from './ComingSoonPage.module.css';

export function ComingSoonPage({title}: {title: string}) {
  return (
    <DashboardShell>
      <div className={styles.wrap}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>This module is coming next.</p>
      </div>
    </DashboardShell>
  );
}
