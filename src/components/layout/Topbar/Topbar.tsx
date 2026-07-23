import {Bell, Search} from 'lucide-react';
import {useAuth} from '../../../auth/AuthContext';
import styles from './Topbar.module.css';

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({onMenuClick}: TopbarProps) {
  const {admin, logout} = useAuth();
  const initial = (admin?.name || 'A').charAt(0).toUpperCase();

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <label className={styles.search}>
        <Search size={16} strokeWidth={2} className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search analytics, users, or tickets..."
          aria-label="Search"
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
          <span className={styles.dot} />
        </button>
        <button
          type="button"
          className={styles.userBtn}
          onClick={() => logout()}
          title="Sign out"
          aria-label="Sign out"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
