import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../api/client';
import {fetchAdminHelp, type AdminHelpSupport} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsHelpPage() {
  const [help, setHelp] = useState<AdminHelpSupport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminHelp();
      setHelp(result.help);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load support info.',
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
      title="Help & Support"
      subtitle="Reach Callkaro support for account, payout, or security assistance."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Support channels</h2>
        {loading ? <p>Loading…</p> : null}
        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        {help ? (
          <dl className={styles.kv}>
            <div className={styles.kvRow}>
              <dt>Email</dt>
              <dd>{help.email}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Priority Desk</dt>
              <dd>{help.phone}</dd>
            </div>
            <div className={styles.kvRow}>
              <dt>Hours</dt>
              <dd>{help.hours}</dd>
            </div>
          </dl>
        ) : null}
      </section>
    </SettingsLayout>
  );
}
