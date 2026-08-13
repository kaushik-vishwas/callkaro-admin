import {
  UserPlus,
  Wallet,
  PhoneCall,
  Flag,
} from 'lucide-react';
import type {ActivityItem} from '../../../api/dashboard';
import styles from './ActivityFeed.module.css';

const icons = {
  pink: UserPlus,
  amber: Wallet,
  green: PhoneCall,
  blue: Flag,
} as const;

type Props = {
  items: ActivityItem[];
};

export function ActivityFeed({items}: Props) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Live Activity Feed</h2>
      {items.length === 0 ? (
        <p className={styles.empty}>No recent activity yet.</p>
      ) : (
        <ul className={styles.list}>
          {items.map(item => {
            const Icon = icons[item.tone] || Flag;
            return (
              <li key={item.id} className={styles.item}>
                <span className={[styles.icon, styles[item.tone]].join(' ')}>
                  <Icon size={15} strokeWidth={2.25} />
                </span>
                <div className={styles.body}>
                  <p className={styles.name}>{item.title}</p>
                  <p className={styles.detail}>{item.detail}</p>
                </div>
                <span className={styles.time}>{item.time}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
