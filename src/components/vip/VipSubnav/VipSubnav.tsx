import {NavLink} from 'react-router-dom';
import styles from './VipSubnav.module.css';

const links = [
  {to: '/vip', label: 'Analytics', end: true},
  {to: '/vip/plans', label: 'Plans', end: false},
  {to: '/vip/users', label: 'Users', end: false},
];

export function VipSubnav() {
  return (
    <nav className={styles.nav} aria-label="VIP sections">
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
