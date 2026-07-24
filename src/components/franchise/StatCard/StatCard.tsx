import type {ReactNode} from 'react';
import styles from './StatCard.module.css';

export type StatTone = 'pink' | 'green' | 'gold' | 'red' | 'blue' | 'purple' | 'dark';

type StatCardProps = {
  label: string;
  value: string | number;
  tone?: StatTone;
  icon?: ReactNode;
};

export function StatCard({label, value, tone = 'pink', icon}: StatCardProps) {
  return (
    <article className={[styles.card, styles[`tone_${tone}`]].join(' ')}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </article>
  );
}
