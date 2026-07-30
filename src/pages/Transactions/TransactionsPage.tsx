import {useMemo, useState} from 'react';
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
import {
  formatInr,
  formatNumber,
  TRANSACTIONS,
  TRANSACTION_STATS,
  type TransactionType,
} from '../../data/transactions';
import styles from './TransactionsPage.module.css';

const PAGE_SIZES = [10, 25, 50];

export function TransactionsPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRANSACTIONS.filter(row => {
      if (typeFilter !== 'all' && row.type !== typeFilter) return false;
      const matchesQuery =
        !q ||
        row.userId.toLowerCase().includes(q) ||
        row.userName.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q);
      const created = new Date(row.dateTime).getTime();
      const fromOk = !dateFrom || created >= new Date(dateFrom).getTime();
      const toOk =
        !dateTo || created <= new Date(`${dateTo}T23:59:59`).getTime();
      return matchesQuery && fromOk && toOk;
    });
  }, [query, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, filtered.length);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const stats = TRANSACTION_STATS;

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
  }

  function exportCsv() {
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
    const lines = filtered.map(row =>
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
            value={formatNumber(stats.totalTransactions)}
            tone="pink"
            icon={<Coins size={15} />}
          />
          <StatCard
            label="VIP Purchases"
            value={formatNumber(stats.vipPurchases)}
            tone="purple"
            icon={<CreditCard size={15} />}
          />
          <StatCard
            label="Total Revenue"
            value={stats.totalRevenueLabel}
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
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Wallet">Wallet</option>
                <option value="VIP">VIP</option>
                <option value="NetBanking">NetBanking</option>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="No transactions match your filters." />
                    </td>
                  </tr>
                ) : null}
                {rows.map(row => (
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
                      <Link
                        to={`/transactions/${row.id}`}
                        className={styles.viewBtn}
                        aria-label={`View ${row.code}`}
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
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
              Showing {start} to {end} of {filtered.length}
            </p>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1)
                .slice(0, 5)
                .map(number => (
                  <button
                    key={number}
                    type="button"
                    className={[
                      styles.pageBtn,
                      number === safePage ? styles.pageActive : '',
                    ].join(' ')}
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </button>
                ))}
              <button
                type="button"
                className={styles.pageBtn}
                disabled={safePage >= totalPages}
                onClick={() => goToPage(safePage + 1)}
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
