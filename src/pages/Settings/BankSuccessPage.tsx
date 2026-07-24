import {Link} from 'react-router-dom';
import {Check} from 'lucide-react';
import {SETTINGS_PROFILE} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankSuccessPage() {
  const updatedOn = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <SettingsLayout title="Bank Update Successful">
      <section className={styles.centerCard}>
        <div className={[styles.iconWrap, styles.iconWrapSuccess].join(' ')}>
          <Check size={30} strokeWidth={3} />
        </div>
        <h2 className={styles.centerTitle}>Bank Details Updated Successfully</h2>
        <p className={styles.centerText}>
          Your new bank account details have been securely saved. Future
          payouts will be processed using the updated account.
        </p>

        <div className={styles.successSummary}>
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Updated On</dt>
              <dd>{updatedOn}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Updated By</dt>
              <dd>{SETTINGS_PROFILE.name}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Reference Number</dt>
              <dd>BNK-2026-07-4587</dd>
            </div>
          </dl>
        </div>

        <div className={styles.centerActions}>
          <Link to="/settings/profile" className={styles.primaryBtn}>
            Return to Profile
          </Link>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            View Bank Details
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
