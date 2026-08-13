import type {ReactNode} from 'react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {SettingsSubnav} from '../../components/settings/SettingsSubnav/SettingsSubnav';
import {useAuth} from '../../auth/AuthContext';
import styles from './SettingsLayout.module.css';

type SettingsLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  hideHeaderMeta?: boolean;
};

export function SettingsLayout({
  title,
  subtitle,
  children,
  hideHeaderMeta = false,
}: SettingsLayoutProps) {
  const {admin} = useAuth();
  const name = admin?.name || 'Admin';
  const status = admin?.status || 'Active';

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.topRow}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>
          {!hideHeaderMeta ? (
            <div className={styles.topMeta}>
              <span className={styles.secureBadge}>
                <span className={styles.dot} />
                System Secure
              </span>
              <div className={styles.userMeta}>
                <div>
                  <p className={styles.userName}>{name}</p>
                  <p className={styles.userRole}>{status}</p>
                </div>
                <span className={styles.avatar}>{name.slice(0, 1)}</span>
              </div>
            </div>
          ) : null}
        </div>

        <SettingsSubnav />

        <div className={styles.content}>{children}</div>
      </div>
    </DashboardShell>
  );
}
