import {useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {AlertTriangle} from 'lucide-react';
import {
  clearBankDraft,
  CURRENT_BANK_ACCOUNT,
  loadBankDraft,
} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankReviewPage() {
  const navigate = useNavigate();
  const draft = loadBankDraft();
  const [confirmed, setConfirmed] = useState(false);

  if (!draft.accountHolder || !draft.iban) {
    return <Navigate to="/settings/bank/update" replace />;
  }

  const current = CURRENT_BANK_ACCOUNT;

  function onConfirm() {
    clearBankDraft();
    navigate('/settings/bank/success');
  }

  return (
    <SettingsLayout
      title="Review Bank Details"
      subtitle="Please double check the modified fields marked below. Payouts sent to incorrect credentials are irreversible."
    >
      <div className={styles.compare}>
        <section className={styles.compareCard}>
          <h2 className={styles.compareTitle}>Current Primary Account</h2>
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Bank Name</dt>
              <dd>{current.bankName}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>IBAN</dt>
              <dd>{current.ibanMasked}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>SWIFT Code</dt>
              <dd>{current.swift}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Branch Name</dt>
              <dd>{current.branchName}</dd>
            </div>
          </dl>
        </section>

        <section className={[styles.compareCard, styles.compareNew].join(' ')}>
          <h2 className={styles.compareTitle}>New Requested Account</h2>
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Bank Name</dt>
              <dd>{draft.bankName}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>IBAN</dt>
              <dd>{draft.iban}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>SWIFT Code</dt>
              <dd>{draft.swift}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Branch Name</dt>
              <dd>{draft.branchName}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className={styles.alert}>
        <AlertTriangle size={16} />
        Please verify the information carefully. Incorrect details may delay
        future payouts.
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={event => setConfirmed(event.target.checked)}
        />
        <span>
          I confirm that the above bank details are accurate and I authorize
          this update. I understand that subsequent transactions will settle
          into this new endpoint.
        </span>
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          disabled={!confirmed}
          onClick={onConfirm}
        >
          Confirm Update
        </button>
        <Link to="/settings/bank/update" className={styles.secondaryBtn}>
          Edit Details
        </Link>
      </div>
    </SettingsLayout>
  );
}
