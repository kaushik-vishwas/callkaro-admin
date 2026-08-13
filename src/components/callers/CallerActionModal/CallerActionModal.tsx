import {useEffect, useState, type FormEvent} from 'react';
import {X} from 'lucide-react';
import styles from './CallerActionModal.module.css';

type ConfirmProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger' | 'warn' | 'default';
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
};

export function CallerConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  tone = 'default',
  busy = false,
  error = '',
  onClose,
  onConfirm,
}: ConfirmProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) return;
    setReason('');
  }, [open]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await onConfirm(reason.trim());
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={event => void onSubmit(event)}>
          <label>
            Reason (optional)
            <input
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="Add a short note for the record"
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.footer}>
            <button type="button" className={styles.ghost} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={
                tone === 'danger'
                  ? styles.danger
                  : tone === 'warn'
                    ? styles.warn
                    : styles.primary
              }
              disabled={busy}
            >
              {busy ? 'Please wait…' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type PasswordProps = {
  open: boolean;
  callerName: string;
  busy?: boolean;
  error?: string;
  resultPassword?: string;
  onClose: () => void;
  onConfirm: (password: string) => void | Promise<void>;
};

export function CallerResetPasswordModal({
  open,
  callerName,
  busy = false,
  error = '',
  resultPassword = '',
  onClose,
  onConfirm,
}: PasswordProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!open) return;
    setPassword('');
  }, [open]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await onConfirm(password);
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2>Reset Password</h2>
            <p>
              Set a new password for <strong>{callerName}</strong>.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {resultPassword ? (
          <div className={styles.success}>
            <p>Password updated successfully.</p>
            <p>
              New password: <strong>{resultPassword}</strong>
            </p>
            <button type="button" className={styles.primary} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={event => void onSubmit(event)}>
            <label>
              New password
              <input
                type="text"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                autoFocus
              />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.footer}>
              <button type="button" className={styles.ghost} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.primary} disabled={busy}>
                {busy ? 'Saving…' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

type InfoProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function CallerInfoModal({open, title, message, onClose}: InfoProps) {
  if (!open) return null;
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.primary} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
