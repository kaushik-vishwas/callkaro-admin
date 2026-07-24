import {Link} from 'react-router-dom';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsOverviewPage() {
  return (
    <SettingsLayout
      title="Settings Overview"
      subtitle="Manage your account profile, security preferences, and payout bank details."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Quick links</h2>
        <div className={styles.actions}>
          <Link to="/settings/profile" className={styles.primaryBtn}>
            Profile Settings
          </Link>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Bank Accounts
          </Link>
          <Link to="/settings/security" className={styles.secondaryBtn}>
            Security & Login
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
