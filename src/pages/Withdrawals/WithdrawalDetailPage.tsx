import {useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {ArrowLeft, Check, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {
  formatInr,
  getWithdrawalById,
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
  if (status === 'pending') return 'PENDING';
  return 'REJECTED';
}

export function WithdrawalDetailPage() {
  const {withdrawalId = ''} = useParams();
  const base = getWithdrawalById(withdrawalId);
  const [status, setStatus] = useState<WithdrawalStatus | null>(
    base?.status ?? null,
  );
  const [message, setMessage] = useState('');

  if (!base) {
    return <Navigate to="/withdrawals" replace />;
  }

  const currentStatus = status ?? base.status;
  const canReview = currentStatus === 'pending';

  function onApprove() {
    setStatus('approved');
    setMessage('Withdrawal approved.');
  }

  function onReject() {
    setStatus('rejected');
    setMessage('Withdrawal rejected.');
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <Link to="/withdrawals" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          Withdrawals
        </Link>

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
          </div>
          {canReview ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.approveBtn}
                onClick={onApprove}
              >
                <Check size={15} />
                Approve
              </button>
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={onReject}
              >
                <X size={15} />
                Reject
              </button>
            </div>
          ) : null}
        </header>

        {message ? <p className={styles.message}>{message}</p> : null}

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Receiver Information</h2>
            <div className={styles.receiver}>
              <span className={styles.avatar}>{base.initials}</span>
              <div className={styles.receiverMeta}>
                <p className={styles.receiverName}>{base.receiverName}</p>
                <p className={styles.muted}>{base.userId}</p>
              </div>
            </div>
            <dl className={styles.kv}>
              <div>
                <dt>Mobile Number</dt>
                <dd>{base.mobile}</dd>
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
                    {base.accountStatus === 'active'
                      ? 'Active'
                      : base.accountStatus === 'blocked'
                        ? 'Blocked'
                        : 'Suspended'}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Financial Snapshot</h2>
            <dl className={styles.kv}>
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
                <dt>Prev Withdrawals</dt>
                <dd>{base.prevWithdrawalsLabel}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Bank Details</h2>
          <dl className={styles.bankGrid}>
            <div>
              <dt>Bank Name</dt>
              <dd>{base.bankName}</dd>
            </div>
            <div>
              <dt>Account Holder</dt>
              <dd>{base.accountHolder}</dd>
            </div>
            <div>
              <dt>IFSC Code</dt>
              <dd>{base.ifsc}</dd>
            </div>
            <div>
              <dt>Account Number</dt>
              <dd>{base.accountNumber}</dd>
            </div>
          </dl>
        </section>

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
                ) : null}
                {base.recentWithdrawals.map(row => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.type}</td>
                    <td>{formatInr(row.amount)}</td>
                    <td>
                      <span
                        className={[
                          styles.txStatus,
                          styles[`tx_${row.status}`],
                        ].join(' ')}
                      >
                        {recentStatusLabel(row.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
