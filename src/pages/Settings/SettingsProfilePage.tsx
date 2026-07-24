import {SETTINGS_PROFILE} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsProfilePage() {
  return (
    <SettingsLayout
      title="Profile Settings"
      subtitle="Update your display name, contact details, and account preferences."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Account profile</h2>
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Full Name</dt>
            <dd>{SETTINGS_PROFILE.name}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Email</dt>
            <dd>{SETTINGS_PROFILE.email}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Mobile</dt>
            <dd>{SETTINGS_PROFILE.mobileMasked}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Role</dt>
            <dd>{SETTINGS_PROFILE.role}</dd>
          </div>
        </dl>
      </section>
    </SettingsLayout>
  );
}
