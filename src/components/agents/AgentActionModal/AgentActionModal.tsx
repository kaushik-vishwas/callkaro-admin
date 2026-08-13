import {useEffect, useState, type FormEvent} from 'react';
import {X} from 'lucide-react';
import {
  fetchAgentCommissionLedger,
  formatInr,
  type AdminAgentListItem,
  type AdminAgentProfile,
  type AgentCommissionLedgerEntry,
} from '../../../api/agents';
import {ApiError} from '../../../api/client';
import styles from '../../callers/CallerActionModal/CallerActionModal.module.css';

type EditProps = {
  open: boolean;
  agent: Pick<AdminAgentListItem, 'id' | 'name' | 'email' | 'phone' | 'code'>;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    email: string;
    phone: string;
  }) => void | Promise<void>;
};

export function AgentEditModal({
  open,
  agent,
  busy = false,
  error = '',
  onClose,
  onSave,
}: EditProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(agent.name || '');
    setEmail(agent.email || '');
    setPhone(agent.phone || '');
  }, [open, agent]);

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
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
            <h2>Edit Agent</h2>
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
            Email
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={phone}
              onChange={event => setPhone(event.target.value)}
              placeholder="+91 …"
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

type LedgerProps = {
  open: boolean;
  agent: Pick<AdminAgentProfile, 'id' | 'name' | 'code'>;
  onClose: () => void;
};

export function AgentCommissionLedgerModal({
  open,
  agent,
  onClose,
}: LedgerProps) {
  const [rows, setRows] = useState<AgentCommissionLedgerEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryLabel, setSummaryLabel] = useState('₹ 0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [open, agent.id]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    void fetchAgentCommissionLedger(agent.id, {page, limit: 15})
      .then(result => {
        if (cancelled) return;
        setRows(result.ledger || []);
        setTotalPages(result.pagination.totalPages || 1);
        setSummaryLabel(result.summary.totalCommissionLabel || '₹ 0');
      })
      .catch(err => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load commission ledger.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, agent.id, page]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
        style={{width: 'min(100%, 720px)'}}
      >
        <div className={styles.head}>
          <div>
            <h2>Commission Ledger</h2>
            <p>
              {agent.name} ({agent.code}) · Total {summaryLabel}
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

        {loading ? <p className={styles.error}>Loading ledger…</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <div style={{overflowX: 'auto', maxHeight: 360}}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th style={{textAlign: 'left', padding: '8px 6px'}}>Date</th>
                <th style={{textAlign: 'left', padding: '8px 6px'}}>Receiver</th>
                <th style={{textAlign: 'left', padding: '8px 6px'}}>Source</th>
                <th style={{textAlign: 'right', padding: '8px 6px'}}>
                  Receiver ₹
                </th>
                <th style={{textAlign: 'right', padding: '8px 6px'}}>
                  Commission
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{padding: 12, color: '#6b7280'}}>
                    No commission entries yet.
                  </td>
                </tr>
              ) : null}
              {rows.map(row => (
                <tr key={row.id} style={{borderTop: '1px solid #e5e7eb'}}>
                  <td style={{padding: '8px 6px'}}>{row.date}</td>
                  <td style={{padding: '8px 6px'}}>{row.receiverName}</td>
                  <td style={{padding: '8px 6px'}}>{row.sourceLabel}</td>
                  <td style={{padding: '8px 6px', textAlign: 'right'}}>
                    {formatInr(row.receiverEarnings)}
                  </td>
                  <td style={{padding: '8px 6px', textAlign: 'right'}}>
                    {formatInr(row.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.ghost}
            disabled={page <= 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{fontSize: 13, color: '#6b7280'}}>
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            className={styles.ghost}
            disabled={page >= totalPages || loading}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
          <button type="button" className={styles.primary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
