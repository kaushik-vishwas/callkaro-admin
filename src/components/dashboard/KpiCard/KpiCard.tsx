import {useId} from 'react';
import {TrendingUp} from 'lucide-react';
import type {KpiItem} from '../../../api/dashboard';
import styles from './KpiCard.module.css';

export function KpiCard({item}: {item: KpiItem}) {
  const popupId = useId();
  const hasBreakdown = Boolean(item.breakdown?.length);

  return (
    <article
      className={`${styles.card} ${hasBreakdown ? styles.hasPopup : ''}`}
      tabIndex={hasBreakdown ? 0 : undefined}
      aria-describedby={hasBreakdown ? popupId : undefined}>
      <p className={styles.label}>{item.label}</p>
      <div className={styles.valueRow}>
        <p className={styles.value}>{item.value}</p>
        {item.trend === 'up' ? (
          <span className={styles.trend} aria-label="Trending up">
            <TrendingUp size={14} strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      {item.hint ? <p className={styles.hint}>{item.hint}</p> : null}

      {hasBreakdown ? (
        <div id={popupId} role="tooltip" className={styles.popup}>
          <p className={styles.popupTitle}>{item.label} breakdown</p>
          <ul className={styles.popupList}>
            {item.breakdown!.map(row => (
              <li key={row.id}>
                <span>{row.label}</span>
                <strong>{row.value.toLocaleString('en-IN')}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
