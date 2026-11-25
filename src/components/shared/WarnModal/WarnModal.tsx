import {useEffect, useRef, useState, type FormEvent} from 'react';
import {TriangleAlert, X} from 'lucide-react';
import {ApiError} from '../../../api/client';
import styles from './WarnModal.module.css';

const MAX_LENGTH = 500;

type Props = {
  /** Who is being warned; null = closed. */
  target: {id: string; name: string} | null;
  /** e.g. "receiver's app" / "caller's app" — shown in the description. */
  appLabel: string;
  /** Sends the warning; should throw on failure. */
  send: (id: string, message: string) => Promise<unknown>;
  onClose: () => void;
  onSent: (name: string) => void;
};

/**
 * Admin warning popup. The message is delivered to the user's app as an
 * "Account warning" notification; account status doesn't change.
 */
export function WarnModal({target, appLabel, send, onClose, onSent}: Props) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!target) return;
    setMessage('');
    setError('');
    setSending(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, sending, onClose]);

  if (!target) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      setError('Write the warning message.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await send(target!.id, text);
      onSent(target!.name);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send warning.');
      setSending(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={() => !sending && onClose()}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warn-modal-title"
        onClick={e => e.stopPropagation()}>
        <div className={styles.head}>
          <span className={styles.icon}>
            <TriangleAlert size={18} />
          </span>
          <div className={styles.headText}>
            <h2 id="warn-modal-title">Warn {target.name}</h2>
            <p>This message is sent to the {appLabel} as a warning.</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={sending}
            aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label} htmlFor="warn-message">
            Warning message
          </label>
          <textarea
            id="warn-message"
            ref={textareaRef}
            className={styles.textarea}
            value={message}
            maxLength={MAX_LENGTH}
            rows={5}
            placeholder="e.g. Please follow the community guidelines. Repeated violations may lead to suspension."
            onChange={e => {
              setMessage(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
          />
          <div className={styles.meta}>
            {error ? <span className={styles.error}>{error}</span> : <span />}
            <span className={styles.count}>
              {message.length}/{MAX_LENGTH}
            </span>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.ghost}
              onClick={onClose}
              disabled={sending}>
              Cancel
            </button>
            <button type="submit" className={styles.primary} disabled={sending}>
              {sending ? 'Sending…' : 'Send Warning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
