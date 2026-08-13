import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AlertTriangle, Check} from 'lucide-react';
import {ApiError} from '../../api/client';
import {fetchAdminBank, type AdminBankAccount} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankDetailsPage() {
  const [bank, setBank] = useState<AdminBankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminBank();
      setBank(result.bank);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load bank details.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hasBank = Boolean(bank?.iban);

  return (
    <SettingsLayout
      title="Bank Account Details"
      subtitle="Below is the primary bank account used for all your withdrawals and payout transactions."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Primary Payout Account</h2>
        {loading ? <p>Loading bank details…</p> : null}
        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        {!loading && !hasBank ? (
          <p>No bank account saved yet. Add one to receive platform payouts.</p>
        ) : null}
        {hasBank && bank ? (
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Account Holder Name</dt>
              <dd>{bank.accountHolder || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Bank Name</dt>
              <dd>{bank.bankName || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>IBAN</dt>
              <dd>
                {bank.ibanMasked || '—'}
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
              <dd>{bank.swift || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Branch Name</dt>
              <dd>{bank.branchName || '—'}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Country</dt>
              <dd>{bank.country || '—'}</dd>
            </div>
          </dl>
        ) : null}
      </section>

      <div className={styles.alert}>
        <AlertTriangle size={16} />
        Updating bank details requires OTP verification for security.
      </div>

      <div className={styles.actions}>
        <Link to="/settings/bank/verify" className={styles.primaryBtn}>
          {hasBank ? 'Update Bank Details' : 'Add Bank Details'}
        </Link>
      </div>
    </SettingsLayout>
  );
}
