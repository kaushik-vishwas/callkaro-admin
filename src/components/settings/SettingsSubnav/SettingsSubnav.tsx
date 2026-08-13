import {NavLink} from 'react-router-dom';
import {SETTINGS_SECTIONS} from '../../../data/settings';
import styles from './SettingsSubnav.module.css';

export function SettingsSubnav() {
  return (
    <nav className={styles.nav} aria-label="Settings sections">
      {SETTINGS_SECTIONS.map(section => (
        <NavLink
          key={section.id}
          to={section.to}
          end={section.id !== 'bank'}
          className={({isActive}) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          {section.label}
        </NavLink>
      ))}
    </nav>
  );
}
