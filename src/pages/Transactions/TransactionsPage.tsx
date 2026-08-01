import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Download,
  Eye,
  Search,
  Wallet,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchTransactionStats,
  fetchTransactions,
  formatInr,
  formatNumber,
  type TransactionItem,
  type TransactionStats,
  type TransactionType,
} from '../../api/transactions';
import styles from './TransactionsPage.module.css';

const PAGE_SIZES = [10, 25, 50];

export function TransactionsPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState<TransactionItem[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        fetchTransactions({
          q: debouncedQuery || undefined,
          type: typeFilter === 'all' ? undefined : typeFilter,
          page,
          limit: pageSize,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchTransactionStats(),
      ]);
      setRows(listResult.transactions);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load transactions.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, typeFilter, page, pageSize, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
  }

  async function exportCsv() {
    try {
      const result = await fetchTransactions({
        q: debouncedQuery || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
        page: 1,
        limit: 500,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      const header = [
        'Transaction ID',
        'User ID',
        'User Name',
        'Type',
        'Amount',
        'Coins',
        'Date and Time',
        'Status',
      ];
      const lines = result.transactions.map(row =>
        [
          row.code,
          row.userId,
          row.userName,
          row.type,
          String(row.amount),
          String(row.coins),
          row.dateTimeLabel,
          row.status,
        ]
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      );
      const blob = new Blob([[header.join(','), ...lines].join('\n')], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to export transactions.',
      );
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Transactions</h1>
            <p className={styles.subtitle}>
              Monitor and manage all financial activities across the platform.
            </p>
          </div>
          <button type="button" className={styles.exportBtn} onClick={exportCsv}>
            <Download size={15} />
            Export Data
          </button>
        </header>

        <section className={styles.statGrid}>
          <StatCard
            label="Total Transactions"
            value={formatNumber(stats?.totalTransactions || 0)}
            tone="pink"
            icon={<Coins size={15} />}
          />
          <StatCard
            label="VIP Purchases"
            value={formatNumber(stats?.vipPurchases || 0)}
            tone="purple"
            icon={<CreditCard size={15} />}
          />
          <StatCard
            label="Total Revenue"
            value={stats?.totalRevenueLabel || '₹ 0'}
            tone="green"
            icon={<Wallet size={15} />}
          />
        </section>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search size={16} />
              <input
                type="search"
                placeholder="Search User ID, User Name..."
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className={styles.selectField}>
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={event => {
                  setTypeFilter(event.target.value as 'all' | TransactionType);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="Recharge">Recharge</option>
                <option value="VIP">VIP</option>
              </select>
            </label>
            <label className={styles.dateField}>
              <span>Date from</span>
              <input
                type="date"
                value={dateFrom}
                onChange={event => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className={styles.dateField}>
              <span>Date to</span>
              <input
                type="date"
                value={dateTo}
                onChange={event => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Coins</th>
                  <th>Date and Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      <EmptyTableState label="Loading transactions…" />
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      <EmptyTableState label="No transactions match your filters." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? rows.map(row => (
                      <tr key={row.id}>
                        <td className={styles.code}>{row.userId}</td>
                        <td className={styles.strong}>{row.userName}</td>
                        <td>
                          <span className={styles.typeChip}>{row.type}</span>
                        </td>
                        <td>{formatInr(row.amount)}</td>
                        <td>{formatNumber(row.coins)}</td>
                        <td>{row.dateTimeLabel}</td>
                        <td>
                          <span
                            className={[
                              styles.statusChip,
                              styles[`status_${row.status}`],
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/transactions/${encodeURIComponent(row.id)}`}
                            className={styles.viewBtn}
                            aria-label={`View ${row.code}`}
                          >
                            <Eye size={15} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <label className={styles.rowsPerPage}>
              Rows per page
              <select
                value={pageSize}
                onChange={event => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <p className={styles.showing}>
              Showing {start} to {end} of {total}
            </p>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page <= 1 || loading}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map(number => (
                  <button
                    key={number}
                    type="button"
                    className={[
                      styles.pageBtn,
                      number === page ? styles.pageActive : '',
                    ].join(' ')}
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </button>
                ))}
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= totalPages || loading}
                onClick={() => goToPage(page + 1)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
