import {Link} from 'react-router-dom';
import {AlertTriangle, Check} from 'lucide-react';
import {CURRENT_BANK_ACCOUNT} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankDetailsPage() {
  const bank = CURRENT_BANK_ACCOUNT;

  return (
    <SettingsLayout
      title="Bank Account Details"
      subtitle="Below is the primary bank account used for all your withdrawals and payout transactions."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Primary Payout Account</h2>
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Account Holder Name</dt>
            <dd>{bank.accountHolder}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Bank Name</dt>
            <dd>{bank.bankName}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>IBAN</dt>
            <dd>
              {bank.ibanMasked}
              {bank.verified ? (
                <span className={styles.verified}>
                  <Check size={12} strokeWidth={3} />
                  Verified
                </span>
              ) : null}
            </dd>
          </div>
          <div className={styles.kvRow}>
            <dt>SWIFT Code</dt>
            <dd>{bank.swift}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Branch Name</dt>
            <dd>{bank.branchName}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Country</dt>
            <dd>{bank.country}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.alert}>
        <AlertTriangle size={16} />
        Updating bank details requires OTP verification for security.
      </div>

      <div className={styles.actions}>
        <Link to="/settings/bank/verify" className={styles.primaryBtn}>
          Update Bank Details
        </Link>
      </div>
    </SettingsLayout>
  );
}
