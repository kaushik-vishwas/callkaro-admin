import {useEffect, useState, type FormEvent} from 'react';
import {Check, Copy, Eye, EyeOff, X} from 'lucide-react';
import {createAgent} from '../../../api/agents';
import {ApiError} from '../../../api/client';
import styles from './CreateAgentModal.module.css';

type CreateAgentModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

type FormState = {
  name: string;
  location: string;
  mobile: string;
  email: string;
  profileLimit: string;
  perMinuteCharge: string;
  password: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: '',
  location: '',
  mobile: '',
  email: '',
  profileLimit: '',
  perMinuteCharge: '',
  password: '',
};

const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors backend rules so most mistakes are caught before submit. */
function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) {
    errors.name = 'Enter the agent or organization name.';
  }
  if (!form.location.trim()) errors.location = 'Enter a location.';
  if (!/^[6-9]\d{9}$/.test(form.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }
  if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email ID.';
  }
  const limit = Number(form.profileLimit);
  if (!form.profileLimit || !Number.isInteger(limit) || limit < 1) {
    errors.profileLimit = 'Enter a whole number of 1 or more.';
  }
  const charge = Number(form.perMinuteCharge);
  if (form.perMinuteCharge === '' || !Number.isFinite(charge) || charge < 0) {
    errors.perMinuteCharge = 'Enter a valid amount.';
  }
  if (form.password && form.password.length < MIN_PASSWORD) {
    errors.password = `At least ${MIN_PASSWORD} characters, or leave empty.`;
  }
  return errors;
}

export function CreateAgentModal({
  open,
  onClose,
  onCreated,
}: CreateAgentModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [created, setCreated] = useState<{
    email: string;
    password: string;
    generated: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setErrors({});
    setError('');
    setShowPassword(false);
    setCreated(null);
    setCopied(false);
  }, [open]);

  if (!open) return null;

  const set = (key: keyof FormState) => (value: string) => {
    setForm(prev => ({...prev, [key]: value}));
    if (errors[key]) setErrors(prev => ({...prev, [key]: undefined}));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setError('');
    try {
      const result = await createAgent({
        name: form.name.trim(),
        location: form.location.trim(),
        phone: `+91${form.mobile}`,
        email: form.email.trim(),
        profileLimit: Number(form.profileLimit),
        perMinuteCharge: Number(form.perMinuteCharge),
        password: form.password || undefined,
      });
      setCreated({
        email: result.agent.email,
        password: result.temporaryPassword,
        generated: !form.password,
      });
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create agent.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copyCredentials() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(
        `Email: ${created.email}\nPassword: ${created.password}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the values are visible to copy by hand */
    }
  }

  const fieldError = (key: keyof FormState) =>
    errors[key] ? <span className={styles.fieldError}>{errors[key]}</span> : null;

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

        {created ? (
          <div className={styles.success}>
            <p className={styles.successTitle}>Agent created successfully.</p>
            <div className={styles.credentials}>
              <div>
                <span>Login email</span>
                <strong>{created.email}</strong>
              </div>
              <div>
                <span>
                  Password{created.generated ? ' (auto-generated)' : ''}
                </span>
                <strong>{created.password}</strong>
              </div>
            </div>
            <p className={styles.note}>
              Share these with the agent now — the password isn&apos;t shown
              again. Agents can&apos;t change their password; you can reset it
              from the agent&apos;s profile.
            </p>
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => void copyCredentials()}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy credentials'}
              </button>
              <button type="button" className={styles.primary} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label>
              Agent Name or Organization Name
              <input
                value={form.name}
                onChange={e => set('name')(e.target.value)}
                placeholder="Rahul Mehta / Star Talent Agency"
                maxLength={120}
                aria-invalid={Boolean(errors.name)}
              />
              {fieldError('name')}
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={e => set('location')(e.target.value)}
                placeholder="Mumbai, Maharashtra"
                maxLength={120}
                aria-invalid={Boolean(errors.location)}
              />
              {fieldError('location')}
            </label>

            <label>
              Mobile No
              <span className={styles.prefixInput}>
                <span className={styles.prefix}>+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.mobile}
                  onChange={e =>
                    set('mobile')(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="98765 43210"
                  aria-invalid={Boolean(errors.mobile)}
                />
              </span>
              {fieldError('mobile')}
            </label>

            <label>
              Email ID
              <input
                type="email"
                value={form.email}
                onChange={e => set('email')(e.target.value)}
                placeholder="agent@example.com"
                autoComplete="off"
                aria-invalid={Boolean(errors.email)}
              />
              {fieldError('email')}
            </label>

            <div className={styles.row}>
              <label>
                Number of Profiles
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={form.profileLimit}
                  onChange={e => set('profileLimit')(e.target.value)}
                  placeholder="e.g. 25"
                  aria-invalid={Boolean(errors.profileLimit)}
                />
                {fieldError('profileLimit')}
              </label>

              <label>
                Per Minute Charges
                <span className={styles.prefixInput}>
                  <span className={styles.prefix}>₹</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={form.perMinuteCharge}
                    onChange={e => set('perMinuteCharge')(e.target.value)}
                    placeholder="0.00"
                    aria-invalid={Boolean(errors.perMinuteCharge)}
                  />
                </span>
                {fieldError('perMinuteCharge')}
              </label>
            </div>

            <label>
              Password
              <span className={styles.prefixInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password')(e.target.value)}
                  placeholder="Leave empty to auto-generate"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              {fieldError('password') || (
                <span className={styles.hint}>
                  Auto-generated if left empty. The agent can&apos;t change it.
                </span>
              )}
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
