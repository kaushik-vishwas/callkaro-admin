import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../api/client';
import {fetchAdminHelp, updateAdminHelp, type AdminHelpSupport} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

const EMPTY: AdminHelpSupport = {email: '', phone: '', hours: ''};

export function SettingsHelpPage() {
  const [saved, setSaved] = useState<AdminHelpSupport | null>(null);
  const [draft, setDraft] = useState<AdminHelpSupport>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminHelp();
      setSaved(result.help);
      setDraft(result.help);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load support info.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const result = await updateAdminHelp(draft);
      setSaved(result.help);
      setDraft(result.help);
      setNotice('Support contact updated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save support info.');
    } finally {
      setSaving(false);
    }
  }

  const dirty = saved !== null && JSON.stringify(saved) !== JSON.stringify(draft);

  const field = (key: keyof AdminHelpSupport, label: string) => (
    <div className={styles.kvRow} key={key}>
      <dt>{label}</dt>
      <dd>
        <input
          type="text"
          value={draft[key]}
          onChange={event => setDraft({...draft, [key]: event.target.value})}
          aria-label={label}
          disabled={loading}
          style={{width: '100%', maxWidth: 360, padding: '6px 8px'}}
        />
      </dd>
    </div>
  );

  return (
    <SettingsLayout
      title="Help & Support"
      subtitle="Reach Callkaro support for account, payout, or security assistance."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Support channels</h2>
        {loading ? <p>Loading…</p> : null}
        {error ? <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p> : null}
        {notice ? <p style={{color: '#047857', fontWeight: 600}}>{notice}</p> : null}
        {!loading ? (
          <dl className={styles.kv}>
            {field('email', 'Support email')}
            {field('phone', 'Priority desk phone')}
            {field('hours', 'Hours')}
          </dl>
        ) : null}
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={!dirty || saving || loading}
          style={{marginTop: 12, padding: '8px 16px', borderRadius: 8, border: 0, background: 'var(--color-brand)', color: '#fff', fontWeight: 700, cursor: 'pointer'}}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </section>
    </SettingsLayout>
  );
}
