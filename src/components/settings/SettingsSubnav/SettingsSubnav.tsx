import {NavLink} from 'react-router-dom';
import {ShieldCheck} from 'lucide-react';
import {SETTINGS_SECTIONS} from '../../../data/settings';
import styles from './SettingsSubnav.module.css';

export function SettingsSubnav() {
  return (
    <aside className={styles.aside}>
      <p className={styles.eyebrow}>Account</p>
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
      <div className={styles.secure}>
        <ShieldCheck size={16} />
        <div>
          <p className={styles.secureTitle}>Secure Terminal</p>
          <p className={styles.secureText}>
            Bank-grade encryption &amp; PCI-compliant storage.
          </p>
        </div>
      </div>
    </aside>
  );
}
