import {useEffect, useState, type FormEvent} from 'react';
import {useAuth} from '../../auth/AuthContext';
import {ApiError} from '../../api/client';
import {changeAdminPassword, updateAdminProfile} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function SettingsSecurityPage() {
  const {admin, refresh} = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMessage('');
    setError('');
  }, [admin?.id]);

  async function onToggle2fa() {
    setToggleBusy(true);
    setError('');
    setMessage('');
    try {
      await updateAdminProfile({
        twoFactorEnabled: !(admin?.twoFactorEnabled !== false),
      });
      await refresh();
      setMessage('Two-factor preference updated.');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update 2FA.',
      );
    } finally {
      setToggleBusy(false);
    }
  }

  async function onChangePassword(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refresh();
      setMessage('Password updated successfully.');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to change password.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SettingsLayout
      title="Security & Login"
      subtitle="Protect your account with password updates and two-factor authentication."
    >
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Login security</h2>
        {message ? <p className={styles.verified}>{message}</p> : null}
        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Two-Factor Auth</dt>
            <dd>
              <span className={styles.verified}>
                {admin?.twoFactorEnabled !== false ? 'Enabled' : 'Disabled'}
              </span>
              <button
                type="button"
                className={styles.linkBtn}
                style={{marginLeft: 10}}
                disabled={toggleBusy}
                onClick={() => void onToggle2fa()}
              >
                {admin?.twoFactorEnabled !== false ? 'Disable' : 'Enable'}
              </button>
            </dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Last Password Change</dt>
            <dd>{admin?.passwordChangedAtLabel || '—'}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Last Login</dt>
            <dd>{admin?.lastLoginAtLabel || '—'}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Active Sessions</dt>
            <dd>{admin?.activeSessionsLabel || '1 device (this browser)'}</dd>
          </div>
        </dl>
      </section>

      <form
        className={styles.card}
        onSubmit={event => void onChangePassword(event)}
      >
        <h2 className={styles.cardTitle}>Change password</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="current">Current password</label>
            <input
              id="current"
              type="password"
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="next">New password</label>
            <input
              id="next"
              type="password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
        </div>
        <div className={styles.actions} style={{marginTop: 16}}>
          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </form>
    </SettingsLayout>
  );
}
