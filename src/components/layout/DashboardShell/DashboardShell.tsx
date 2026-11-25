import {useEffect, useState, type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {Sidebar} from '../Sidebar/Sidebar';
import {Topbar} from '../Topbar/Topbar';
import styles from './DashboardShell.module.css';

export function DashboardShell({
  children,
  showSearch = true,
}: {
  children: ReactNode;
  showSearch?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <div className={styles.desktopSidebar}>
        <Sidebar />
      </div>

      {mobileOpen ? (
        <div className={styles.mobileOverlay}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className={styles.mobileSidebar}>
            <Sidebar />
          </div>
        </div>
      ) : null}

      <div className={styles.main}>
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          showSearch={showSearch}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
