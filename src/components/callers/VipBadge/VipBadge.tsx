import styles from './VipBadge.module.css';

export function VipBadge({vip}: {vip: boolean}) {
  if (!vip) return <span className={styles.empty}>—</span>;
  return <span className={styles.badge}>VIP</span>;
}
