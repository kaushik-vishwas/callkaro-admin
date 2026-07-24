import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsSecurityPage() {
  return (
    <SettingsLayout
      title="Security & Login"
      subtitle="Protect your account with password updates and two-factor authentication."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Login security</h2>
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Two-Factor Auth</dt>
            <dd>
              <span className={styles.verified}>Enabled</span>
            </dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Last Password Change</dt>
            <dd>03 Jun 2026</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Active Sessions</dt>
            <dd>2 devices</dd>
          </div>
        </dl>
      </section>
    </SettingsLayout>
  );
}
