import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../api/client';
import {fetchAdminWallet, type AdminWalletSnapshot} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsWalletPage() {
  const [wallet, setWallet] = useState<AdminWalletSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminWallet();
      setWallet(result.wallet);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load wallet.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SettingsLayout
      title="My Wallet"
      subtitle="Live platform cash position from paid revenue and withdrawals."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Wallet snapshot</h2>
        {loading ? <p>Loading wallet…</p> : null}
        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        {wallet ? (
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Available Balance</dt>
              <dd>{wallet.availableBalanceLabel}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Pending Settlements</dt>
              <dd>{wallet.pendingSettlementsLabel}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Last Payout</dt>
              <dd>{wallet.lastPayoutLabel}</dd>
            </div>
          </dl>
        ) : null}
      </section>
    </SettingsLayout>
  );
}
