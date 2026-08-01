import {useEffect, useState} from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {ArrowLeft, CreditCard, Download, UserRound} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ApiError} from '../../api/client';
import {
  fetchTransaction,
  formatInr,
  formatNumber,
  type TransactionItem,
} from '../../api/transactions';
import styles from './TransactionDetailPage.module.css';

function statusLabel(status: string) {
  if (status === 'successful') return 'Successful';
  if (status === 'failed') return 'Failed';
  return 'Pending';
}

export function TransactionDetailPage() {
  const {transactionId = ''} = useParams();
  const [transaction, setTransaction] = useState<TransactionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!transactionId) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const result = await fetchTransaction(decodeURIComponent(transactionId));
        if (!cancelled) {
          setTransaction(result.transaction);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.statusCode === 404) {
            setMissing(true);
          } else {
            setError(
              err instanceof ApiError
                ? err.message
                : 'Failed to load transaction.',
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  if (!loading && missing) {
    return <Navigate to="/transactions" replace />;
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <Link to="/transactions" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          Transactions
        </Link>

        {loading ? <p className={styles.summary}>Loading transaction…</p> : null}
        {error ? <p className={styles.summary}>{error}</p> : null}

        {!loading && transaction ? (
          <>
            <header className={styles.header}>
              <div>
                <div className={styles.titleRow}>
                  <h1 className={styles.title}>
                    Transaction Details {transaction.code}
                  </h1>
                  <span
                    className={[
                      styles.status,
                      styles[`status_${transaction.status}`],
                    ].join(' ')}
                  >
                    {statusLabel(transaction.status)}
                  </span>
                </div>
                <p className={styles.summary}>
                  {transaction.category} ·{' '}
                  {new Date(transaction.dateTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className={styles.amount}>{formatInr(transaction.amount)}</p>
              </div>
              <button type="button" className={styles.receiptBtn}>
                <Download size={15} />
                Export Receipt
              </button>
            </header>

            <div className={styles.cards}>
              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>
                    <UserRound size={16} />
                  </span>
                  <h2>User Information</h2>
                </div>
                <dl className={styles.kv}>
                  <div>
                    <dt>Name</dt>
                    <dd>{transaction.userName}</dd>
                  </div>
                  <div>
                    <dt>User ID</dt>
                    <dd>{transaction.userId.replace(/^#/, '')}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{transaction.userEmail || '—'}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>
                    <CreditCard size={16} />
                  </span>
                  <h2>Payment Info</h2>
                </div>
                <dl className={styles.kv}>
                  <div>
                    <dt>Method</dt>
                    <dd>{transaction.paymentMethod}</dd>
                  </div>
                  <div>
                    <dt>Gateway ID</dt>
                    <dd>{transaction.gatewayId}</dd>
                  </div>
                  <div>
                    <dt>Coins Added</dt>
                    <dd>{formatNumber(transaction.coins)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}
