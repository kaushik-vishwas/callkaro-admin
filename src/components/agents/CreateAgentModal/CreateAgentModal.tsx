import {useEffect, useState, type FormEvent} from 'react';
import {X} from 'lucide-react';
import {createAgent} from '../../../api/agents';
import {ApiError} from '../../../api/client';
import styles from './CreateAgentModal.module.css';

type CreateAgentModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateAgentModal({
  open,
  onClose,
  onCreated,
}: CreateAgentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agentCode, setAgentCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName('');
    setEmail('');
    setPhone('');
    setAgentCode('');
    setPassword('');
    setError('');
    setCreatedPassword('');
  }, [open]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const result = await createAgent({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        agentCode: agentCode.trim() || undefined,
        password: password.trim() || undefined,
      });
      setCreatedPassword(result.temporaryPassword);
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create agent.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-agent-title"
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2 id="create-agent-title">Create Agent</h2>
            <p>Add a new agent account for the agent panel.</p>
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

        {createdPassword ? (
          <div className={styles.success}>
            <p>Agent created successfully.</p>
            <p>
              Temporary password:{' '}
              <strong>{createdPassword}</strong>
            </p>
            <button type="button" className={styles.primary} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              Full name
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Rahul Mehta"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="agent@callkaro.com"
                required
              />
            </label>
            <label>
              Phone
              <input
                value={phone}
                onChange={event => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
            <label>
              Agent code (optional)
              <input
                value={agentCode}
                onChange={event => setAgentCode(event.target.value)}
                placeholder="Auto-generated if empty"
              />
            </label>
            <label>
              Password (optional)
              <input
                type="text"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Auto-generated if empty"
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.footer}>
              <button type="button" className={styles.ghost} onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className={styles.primary}
                disabled={submitting}
              >
                {submitting ? 'Creating…' : 'Create Agent'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
