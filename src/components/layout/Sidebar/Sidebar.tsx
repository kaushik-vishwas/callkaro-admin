import {NavLink} from 'react-router-dom';
import {adminNavItems} from '../../../config/nav';
import {useAuth} from '../../../auth/AuthContext';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const {admin} = useAuth();
  const initial = (admin?.name || 'A').charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoMark} aria-hidden>
          C
        </div>
        <div>
          <p className={styles.brandName}>Callkaro</p>
          <p className={styles.brandSub}>Enterprise Control</p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Admin">
        {adminNavItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({isActive}) =>
                [styles.link, isActive ? styles.active : ''].join(' ')
              }
              end={item.to === '/dashboard'}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatar} aria-hidden>
          {initial}
        </div>
        <div className={styles.profileText}>
          <p className={styles.profileName}>{admin?.name || 'Admin'}</p>
          <p className={styles.profileRole}>SUPER ADMIN</p>
        </div>
      </div>
    </aside>
  );
}
