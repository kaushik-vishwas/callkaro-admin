import {useEffect, useState, type FormEvent} from 'react';
import {Eye, EyeOff, X} from 'lucide-react';
import type {AdminAgentListItem} from '../../../api/agents';
import styles from '../CreateAgentModal/CreateAgentModal.module.css';

export type EditAgentPayload = {
  name: string;
  location: string;
  phone: string;
  email: string;
  profileLimit: number;
  perMinuteCharge: number;
  /** Blank = keep the current password. */
  password?: string;
};

type Props = {
  open: boolean;
  agent: AdminAgentListItem;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onSave: (payload: EditAgentPayload) => void | Promise<void>;
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

const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "+919876543210" / "9876543210" → "9876543210" for the mobile box. */
function localMobile(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = 'Enter the agent or organization name.';
  if (!form.location.trim()) errors.location = 'Enter a location.';
  if (!/^[6-9]\d{9}$/.test(form.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email ID.';
  const limit = Number(form.profileLimit);
  if (!form.profileLimit || !Number.isInteger(limit) || limit < 1) {
    errors.profileLimit = 'Enter a whole number of 1 or more.';
  }
  const charge = Number(form.perMinuteCharge);
  if (form.perMinuteCharge === '' || !Number.isFinite(charge) || charge < 0) {
    errors.perMinuteCharge = 'Enter a valid amount.';
  }
  if (form.password && form.password.length < MIN_PASSWORD) {
    errors.password = `At least ${MIN_PASSWORD} characters, or leave empty to keep it.`;
  }
  return errors;
}

/**
 * Edit agent — same fields as Create Agent. Password is optional here:
 * leave it empty to keep the current one.
 */
export function EditAgentModal({
  open,
  agent,
  busy = false,
  error = '',
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: '',
    location: '',
    mobile: '',
    email: '',
    profileLimit: '',
    perMinuteCharge: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: agent.name || '',
      location: agent.location || '',
      mobile: localMobile(agent.phone),
      email: agent.email || '',
      profileLimit: agent.profileLimit != null ? String(agent.profileLimit) : '',
      perMinuteCharge:
        agent.perMinuteCharge != null ? String(agent.perMinuteCharge) : '',
      password: '',
    });
    setErrors({});
    setShowPassword(false);
  }, [open, agent]);

  if (!open) return null;

  const set = (key: keyof FormState) => (value: string) => {
    setForm(prev => ({...prev, [key]: value}));
    if (errors[key]) setErrors(prev => ({...prev, [key]: undefined}));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    await onSave({
      name: form.name.trim(),
      location: form.location.trim(),
      phone: `+91${form.mobile}`,
      email: form.email.trim(),
      profileLimit: Number(form.profileLimit),
      perMinuteCharge: Number(form.perMinuteCharge),
      password: form.password || undefined,
    });
  }

  const fieldError = (key: keyof FormState) =>
    errors[key] ? <span className={styles.fieldError}>{errors[key]}</span> : null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-agent-title"
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2 id="edit-agent-title">Edit Agent</h2>
            <p>
              Update details for {agent.name} ({agent.code}).
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

        <form className={styles.form} onSubmit={event => void onSubmit(event)} noValidate>
          <label>
            Agent Name or Organization Name
            <input
              value={form.name}
              onChange={e => set('name')(e.target.value)}
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
                placeholder="Leave empty to keep current password"
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
                Only fill this to change the agent&apos;s password.
              </span>
            )}
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.footer}>
            <button type="button" className={styles.ghost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primary} disabled={busy}>
              {busy ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
