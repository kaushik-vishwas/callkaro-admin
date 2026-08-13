import {useCallback, useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {ArrowLeft, Check, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ApiError} from '../../api/client';
import {fetchWithdrawal, updateWithdrawal} from '../../api/withdrawals';
import {
  formatInr,
  type WithdrawalItem,
  type WithdrawalStatus,
} from '../../data/withdrawals';
import styles from './WithdrawalDetailPage.module.css';

function statusLabel(status: WithdrawalStatus) {
  if (status === 'pending') return 'Pending Review';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Successful';
}

function recentStatusLabel(status: string) {
  if (status === 'successful') return 'SUCCESSFUL';
  if (status === 'approved') return 'APPROVED';
  if (status === 'pending') return 'PENDING';
  return 'REJECTED';
}

export function WithdrawalDetailPage() {
  const {withdrawalId = ''} = useParams();
  const [base, setBase] = useState<WithdrawalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [utr, setUtr] = useState('');

  const load = useCallback(async () => {
    if (!withdrawalId) return;
    setLoading(true);
    setError('');
    try {
      const result = await fetchWithdrawal(withdrawalId);
      setBase(result.withdrawal);
      setUtr(result.withdrawal.utr || '');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Failed to load withdrawal.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [withdrawalId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (notFound) {
    return <Navigate to="/withdrawals" replace />;
  }

  if (loading || !base) {
    return (
      <DashboardShell>
        <div className={styles.page}>
          <Link to="/withdrawals" className={styles.back}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Withdrawals
          </Link>
          <p className={styles.muted}>
            {loading ? 'Loading withdrawal…' : error || 'Not found.'}
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currentStatus = base.status;
  const canApprove = currentStatus === 'pending';
  const canReject =
    currentStatus === 'pending' || currentStatus === 'approved';
  const canPay = currentStatus === 'approved' || currentStatus === 'pending';

  async function runAction(
    action: 'approve' | 'reject' | 'pay',
    payload: {reason?: string; utr?: string} = {},
  ) {
    if (!base) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await updateWithdrawal(base.id, action, payload);
      setBase(result.withdrawal);
      setUtr(result.withdrawal.utr || '');
      setMessage(
        action === 'approve'
          ? 'Withdrawal approved.'
          : action === 'reject'
            ? 'Withdrawal rejected. Funds refunded to wallet if held.'
            : 'Withdrawal marked successful.',
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update withdrawal.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <Link to="/withdrawals" className={styles.back}>
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Withdrawals
        </Link>

        {message ? <p className={styles.message}>{message}</p> : null}
        {error ? <p className={styles.muted}>{error}</p> : null}

        <header className={styles.header}>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{base.code}</h1>
              <span
                className={[
                  styles.status,
                  styles[`status_${currentStatus}`],
                ].join(' ')}
              >
                {statusLabel(currentStatus)}
              </span>
            </div>
            <p className={styles.amount}>{formatInr(base.amount)}</p>
            {base.netInr ? (
              <p className={styles.muted}>
                Fee {formatInr(base.feeInr || 0)} · Net{' '}
                {formatInr(base.netInr)}
              </p>
            ) : null}
          </div>
          <div className={styles.actions}>
            {canApprove ? (
              <button
                type="button"
                className={styles.approveBtn}
                disabled={busy}
                onClick={() => void runAction('approve')}
              >
                <Check size={15} />
                Approve
              </button>
            ) : null}
            {canPay && currentStatus === 'approved' ? (
              <button
                type="button"
                className={styles.approveBtn}
                disabled={busy}
                onClick={() => void runAction('pay', {utr: utr.trim() || undefined})}
              >
                <Check size={15} />
                Mark Paid
              </button>
            ) : null}
            {canReject ? (
              <button
                type="button"
                className={styles.rejectBtn}
                disabled={busy}
                onClick={() =>
                  void runAction('reject', {
                    reason: rejectReason.trim() || 'Rejected by admin',
                  })
                }
              >
                <X size={15} />
                Reject
              </button>
            ) : null}
          </div>
        </header>

        {(canReject || canPay) && currentStatus !== 'successful' ? (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Admin notes</h2>
            <div className={styles.grid} style={{gridTemplateColumns: '1fr 1fr'}}>
              <label className={styles.muted}>
                Reject reason
                <input
                  value={rejectReason}
                  onChange={event => setRejectReason(event.target.value)}
                  placeholder="Optional reason"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 6,
                    height: 40,
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    padding: '0 12px',
                  }}
                />
              </label>
              <label className={styles.muted}>
                UTR / reference
                <input
                  value={utr}
                  onChange={event => setUtr(event.target.value)}
                  placeholder="Enter bank UTR when marking paid"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 6,
                    height: 40,
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    padding: '0 12px',
                  }}
                />
              </label>
            </div>
            {base.failureReason ? (
              <p className={styles.muted} style={{marginTop: 12}}>
                Last reason: {base.failureReason}
              </p>
            ) : null}
            {base.utr ? (
              <p className={styles.muted} style={{marginTop: 8}}>
                UTR: {base.utr}
                {base.paidAtLabel ? ` · Paid ${base.paidAtLabel}` : ''}
              </p>
            ) : null}
          </section>
        ) : null}

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Receiver</h2>
            <div className={styles.receiver}>
              <span className={styles.avatar}>{base.initials}</span>
              <div>
                <p className={styles.receiverName}>{base.receiverName}</p>
                <p className={styles.muted}>{base.userId}</p>
              </div>
            </div>
            <dl className={styles.kv}>
              <div>
                <dt>Request Date</dt>
                <dd>{base.requestDateLabel}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{base.level}</dd>
              </div>
              <div>
                <dt>Account Status</dt>
                <dd>
                  <span
                    className={[
                      styles.accountStatus,
                      styles[`account_${base.accountStatus}`],
                    ].join(' ')}
                  >
                    {base.accountStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Wallet Balance</dt>
                <dd>{formatInr(base.walletBalance)}</dd>
              </div>
              <div>
                <dt>Total Earnings</dt>
                <dd>{formatInr(base.totalEarnings)}</dd>
              </div>
              <div>
                <dt>Pending Amount</dt>
                <dd>{formatInr(base.pendingAmount)}</dd>
              </div>
              <div>
                <dt>Previous Withdrawals</dt>
                <dd>{base.prevWithdrawalsLabel}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Bank Details</h2>
            <dl className={styles.bankGrid}>
              <div>
                <dt>Bank</dt>
                <dd>{base.bankName}</dd>
              </div>
              <div>
                <dt>Account Holder</dt>
                <dd>{base.accountHolder}</dd>
              </div>
              <div>
                <dt>IFSC</dt>
                <dd>{base.ifsc}</dd>
              </div>
              <div>
                <dt>Account</dt>
                <dd>{base.accountNumber}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Withdrawals</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {base.recentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.empty}>
                      No previous withdrawals.
                    </td>
                  </tr>
                ) : (
                  base.recentWithdrawals.map(item => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.type}</td>
                      <td>{formatInr(item.amount)}</td>
                      <td>
                        <span
                          className={[
                            styles.txStatus,
                            styles[`tx_${item.status === 'approved' ? 'pending' : item.status}`],
                          ].join(' ')}
                        >
                          {recentStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
