import {useEffect, useState, type FormEvent} from 'react';
import {useAuth} from '../../auth/AuthContext';
import {ApiError} from '../../api/client';
import {updateAdminProfile} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsProfilePage() {
  const {admin, refresh} = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(admin?.name || '');
    setPhone(admin?.phone || '');
  }, [admin]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await updateAdminProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      await refresh();
      setMessage('Profile updated.');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update profile.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SettingsLayout
      title="Profile Settings"
      subtitle="Update your display name, contact details, and account preferences."
    >
      <form className={styles.card} onSubmit={event => void onSave(event)}>
        <h2 className={styles.cardTitle}>Account profile</h2>
        {message ? <p className={styles.verified}>{message}</p> : null}
        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" value={admin?.email || ''} disabled />
          </div>
          <div className={styles.field}>
            <label htmlFor="phone">Mobile</label>
            <input
              id="phone"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="role">Role</label>
            <input id="role" value={admin?.role || 'Super Admin'} disabled />
          </div>
        </div>
        <div className={styles.actions} style={{marginTop: 16}}>
          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </SettingsLayout>
  );
}
