import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {AlertTriangle} from 'lucide-react';
import {
  clearBankChallengeToken,
  clearBankDraft,
  loadBankChallengeToken,
  loadBankDraft,
  saveBankSuccessMeta,
} from '../../data/settings';
import {ApiError} from '../../api/client';
import {confirmAdminBank, fetchAdminBank, type AdminBankAccount} from '../../api/admin';
import {useAuth} from '../../auth/AuthContext';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankReviewPage() {
  const navigate = useNavigate();
  const {admin, refresh} = useAuth();
  const draft = loadBankDraft();
  const challenge = loadBankChallengeToken();
  const [current, setCurrent] = useState<AdminBankAccount | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const result = await fetchAdminBank();
      setCurrent(result.bank);
    } catch {
      setCurrent(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!challenge) {
    return <Navigate to="/settings/bank/verify" replace />;
  }

  if (!draft.accountHolder || !draft.iban) {
    return <Navigate to="/settings/bank/update" replace />;
  }

  async function onConfirm() {
    setBusy(true);
    setError('');
    try {
      const result = await confirmAdminBank(challenge!, {
        accountHolder: draft.accountHolder,
        bankName: draft.bankName,
        iban: draft.iban,
        swift: draft.swift,
        branchName: draft.branchName,
        country: draft.country,
        accountType: draft.accountType,
      });
      saveBankSuccessMeta({
        reference: result.reference,
        updatedOnLabel: result.updatedOnLabel,
        updatedBy: admin?.name || result.admin.name,
      });
      clearBankDraft();
      clearBankChallengeToken();
      await refresh();
      navigate('/settings/bank/success');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to confirm bank update.',
      );
    } finally {
      setBusy(false);
    }
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
              <dd>{current?.bankName || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>IBAN</dt>
              <dd>{current?.ibanMasked || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>SWIFT Code</dt>
              <dd>{current?.swift || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Branch Name</dt>
              <dd>{current?.branchName || '—'}</dd>
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

      {error ? (
        <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
      ) : null}

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
          disabled={!confirmed || busy}
          onClick={() => void onConfirm()}
        >
          {busy ? 'Saving…' : 'Confirm Update'}
        </button>
        <Link to="/settings/bank/update" className={styles.secondaryBtn}>
          Edit Details
        </Link>
      </div>
    </SettingsLayout>
  );
}
