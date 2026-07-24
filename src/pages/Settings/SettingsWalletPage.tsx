import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsWalletPage() {
  return (
    <SettingsLayout
      title="My Wallet"
      subtitle="View available balance and recent ledger activity for your admin account."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Wallet snapshot</h2>
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Available Balance</dt>
            <dd>₹ 1,24,500.00</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Pending Settlements</dt>
            <dd>₹ 12,400.00</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Last Payout</dt>
            <dd>₹ 45,000 · 12 Jul 2026</dd>
          </div>
        </dl>
      </section>
    </SettingsLayout>
  );
}
