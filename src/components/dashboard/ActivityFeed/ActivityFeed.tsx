import {
  UserPlus,
  Wallet,
  PhoneCall,
  Flag,
} from 'lucide-react';
import {activityFeed} from '../../../data/dashboard';
import styles from './ActivityFeed.module.css';

const icons = {
  pink: UserPlus,
  amber: Wallet,
  green: PhoneCall,
  blue: Flag,
} as const;

export function ActivityFeed() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Live Activity Feed</h2>
      <ul className={styles.list}>
        {activityFeed.map(item => {
          const Icon = icons[item.tone];
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
    </section>
  );
}
