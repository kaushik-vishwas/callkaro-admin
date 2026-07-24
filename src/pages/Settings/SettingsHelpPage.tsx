import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsHelpPage() {
  return (
    <SettingsLayout
      title="Help & Support"
      subtitle="Reach Callkaro support for account, payout, or security assistance."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Support channels</h2>
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Email</dt>
            <dd>support@callkaro.com</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Priority Desk</dt>
            <dd>+91 1800 000 2244</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Hours</dt>
            <dd>Mon–Sat, 9:00 AM – 7:00 PM IST</dd>
          </div>
        </dl>
      </section>
    </SettingsLayout>
  );
}
