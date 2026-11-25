import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {adminNavItems} from '../../../config/nav';
import {useAuth} from '../../../auth/AuthContext';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const {admin} = useAuth();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  // Explicit open/closed choice per dropdown. Until the user clicks, a dropdown
  // is open only while one of its sub-pages is the current page.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
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
          const children = item.children ?? [];

          if (children.length === 0) {
            return (
              <div key={item.id} className={styles.group}>
                <NavLink
                  to={item.to}
                  className={({isActive}) =>
                    [styles.link, isActive ? styles.active : ''].join(' ')
                  }
                  end={item.to === '/dashboard'}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              </div>
            );
          }

          // Dropdown: clicking the row opens/closes its sub-items and opens the main page.
          const childActive = children.some(child => pathname === child.to);
          const open = openGroups[item.id] ?? childActive;
          const parentActive = pathname.startsWith(item.to) && !childActive;

          return (
            <div key={item.id} className={styles.group}>
              <button
                type="button"
                className={[styles.link, styles.groupButton, parentActive ? styles.active : '']
                  .join(' ')}
                aria-expanded={open}
                onClick={() => {
                  setOpenGroups(prev => ({...prev, [item.id]: !open}));
                  navigate(item.to);
                }}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')}
                />
              </button>
              {open
                ? children.map(child => {
                    const ChildIcon = child.icon;
                    return (
                      <NavLink
                        key={child.id}
                        to={child.to}
                        className={({isActive}) =>
                          [styles.link, styles.childLink, isActive ? styles.active : ''].join(' ')
                        }
                      >
                        <ChildIcon size={16} strokeWidth={2} />
                        <span>{child.label}</span>
                      </NavLink>
                    );
                  })
                : null}
            </div>
          );
        })}
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatar} aria-hidden>
          {initial}
        </div>
        <div className={styles.profileText}>
          <p className={styles.profileName}>{admin?.name || 'Admin'}</p>
          <p className={styles.profileRole}>
            {(admin?.role || 'Super Admin').toUpperCase()}
          </p>
        </div>
      </div>
    </aside>
  );
}
