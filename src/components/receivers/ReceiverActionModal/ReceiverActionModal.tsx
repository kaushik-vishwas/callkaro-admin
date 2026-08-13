import {useEffect, useState, type FormEvent} from 'react';
import {X} from 'lucide-react';
import {fetchAgents, type AdminAgentListItem} from '../../../api/agents';
import {ApiError} from '../../../api/client';
import type {AdminReceiverProfile} from '../../../api/receivers';
import styles from '../../callers/CallerActionModal/CallerActionModal.module.css';

type EditProps = {
  open: boolean;
  profile: AdminReceiverProfile;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    email: string;
    age: number;
    gender: string;
    level: number;
    bio: string;
    languages: string;
  }) => void | Promise<void>;
};

export function ReceiverEditModal({
  open,
  profile,
  busy = false,
  error = '',
  onClose,
  onSave,
}: EditProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('18');
  const [gender, setGender] = useState('female');
  const [level, setLevel] = useState('1');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(profile.name || '');
    setEmail(profile.email || '');
    setAge(String(profile.age || profile.kyc?.age || 18));
    setGender((profile.gender || 'female').toLowerCase());
    setLevel(String(profile.level || profile.kyc?.level || 1));
    setBio(profile.bio || profile.kyc?.bio || '');
    setLanguages((profile.languages || []).join(', '));
  }, [open, profile]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await onSave({
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      level: Number(level),
      bio: bio.trim(),
      languages,
    });
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
        style={{width: 'min(100%, 520px)'}}
      >
        <div className={styles.head}>
          <div>
            <h2>Edit Receiver</h2>
            <p>Update profile details for {profile.name}.</p>
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
            Full name
            <input
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Login email
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </label>
          <label>
            Age
            <input
              type="number"
              min={18}
              max={80}
              value={age}
              onChange={event => setAge(event.target.value)}
              required
            />
          </label>
          <label>
            Gender
            <select
              value={gender}
              onChange={event => setGender(event.target.value)}
              style={{
                height: 42,
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '0 12px',
                fontSize: 14,
              }}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Level
            <select
              value={level}
              onChange={event => setLevel(event.target.value)}
              style={{
                height: 42,
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '0 12px',
                fontSize: 14,
              }}
            >
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </label>
          <label>
            Languages (comma separated)
            <input
              value={languages}
              onChange={event => setLanguages(event.target.value)}
              placeholder="Hindi, English"
            />
          </label>
          <label>
            Bio
            <textarea
              value={bio}
              onChange={event => setBio(event.target.value)}
              rows={3}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                resize: 'vertical',
              }}
            />
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

type AssignProps = {
  open: boolean;
  currentAgentId?: string;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onAssign: (agentId: string) => void | Promise<void>;
};

export function ReceiverAssignAgentModal({
  open,
  currentAgentId = '',
  busy = false,
  error = '',
  onClose,
  onAssign,
}: AssignProps) {
  const [agents, setAgents] = useState<AdminAgentListItem[]>([]);
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!open) return;
    setAgentId(currentAgentId || '');
    setLoadError('');
    setLoading(true);
    void fetchAgents({tab: 'active', limit: 100})
      .then(result => {
        setAgents(result.agents || []);
        if (!currentAgentId && result.agents?.[0]?.id) {
          setAgentId(result.agents[0].id);
        }
      })
      .catch(err => {
        setLoadError(
          err instanceof ApiError ? err.message : 'Failed to load agents.',
        );
      })
      .finally(() => setLoading(false));
  }, [open, currentAgentId]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agentId) {
      setLoadError('Select an agent.');
      return;
    }
    await onAssign(agentId);
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
            <h2>Assign New Agent</h2>
            <p>Choose an active agent for this receiver.</p>
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
            Agent
            <select
              value={agentId}
              onChange={event => setAgentId(event.target.value)}
              disabled={loading}
              required
              style={{
                height: 42,
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '0 12px',
                fontSize: 14,
              }}
            >
              <option value="" disabled>
                {loading ? 'Loading agents…' : 'Select agent'}
              </option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.code})
                </option>
              ))}
            </select>
          </label>
          {loadError || error ? (
            <p className={styles.error}>{loadError || error}</p>
          ) : null}
          <div className={styles.footer}>
            <button type="button" className={styles.ghost} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primary}
              disabled={busy || loading || !agentId}
            >
              {busy ? 'Assigning…' : 'Assign Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
