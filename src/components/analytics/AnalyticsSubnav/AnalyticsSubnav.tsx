import {NavLink} from 'react-router-dom';
import {ANALYTICS_TABS} from '../../../data/analytics';
import styles from './AnalyticsSubnav.module.css';

export function AnalyticsSubnav() {
  return (
    <nav className={styles.nav} aria-label="Analytics sections">
      {ANALYTICS_TABS.map(tab => (
        <NavLink
          key={tab.id}
          to={tab.to}
          end={tab.id === 'overview'}
          className={({isActive}) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
