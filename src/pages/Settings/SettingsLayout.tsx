import type {ReactNode} from 'react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {SettingsSubnav} from '../../components/settings/SettingsSubnav/SettingsSubnav';
import {SETTINGS_PROFILE} from '../../data/settings';
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
  return (
    <DashboardShell>
      <div className={styles.page}>
        <SettingsSubnav />
        <div className={styles.content}>
          {!hideHeaderMeta ? (
            <div className={styles.topMeta}>
              <span className={styles.secureBadge}>
                <span className={styles.dot} />
                System Secure
              </span>
              <div className={styles.userMeta}>
                <div>
                  <p className={styles.userName}>{SETTINGS_PROFILE.name}</p>
                  <p className={styles.userRole}>{SETTINGS_PROFILE.status}</p>
                </div>
                <span className={styles.avatar}>
                  {SETTINGS_PROFILE.name.slice(0, 1)}
                </span>
              </div>
            </div>
          ) : null}
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </DashboardShell>
  );
}
