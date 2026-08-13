import {NavLink} from 'react-router-dom';
import styles from '../../vip/VipSubnav/VipSubnav.module.css';

const links = [
  {to: '/compliance', label: 'Identity Mismatch', end: true},
  {to: '/compliance/detected-profiles', label: 'Detected Profiles', end: false},
];

export function ComplianceSubnav() {
  return (
    <nav className={styles.nav} aria-label="Compliance sections">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({isActive}) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
