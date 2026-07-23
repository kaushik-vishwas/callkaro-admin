import {TrendingUp} from 'lucide-react';
import type {KpiItem} from '../../../data/dashboard';
import styles from './KpiCard.module.css';

export function KpiCard({item}: {item: KpiItem}) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{item.label}</p>
      <div className={styles.valueRow}>
        <p className={styles.value}>{item.value}</p>
        {item.trend === 'up' ? (
          <span className={styles.trend} aria-label="Trending up">
            <TrendingUp size={14} strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
    </article>
  );
}
