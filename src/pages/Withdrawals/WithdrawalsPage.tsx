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
import {
  formatInr,
  formatNumber,
  WITHDRAWALS,
  WITHDRAWAL_STATS,
  type WithdrawalSort,
} from '../../data/withdrawals';
import styles from './WithdrawalsPage.module.css';

const PAGE_SIZES = [10, 25, 50];

export function WithdrawalsPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<WithdrawalSort>('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = WITHDRAWALS.filter(row => {
      const matchesQuery =
        !q ||
        row.receiverName.toLowerCase().includes(q) ||
        row.userId.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q);
      const created = new Date(row.requestDate).getTime();
      const fromOk = !dateFrom || created >= new Date(dateFrom).getTime();
      const toOk =
        !dateTo || created <= new Date(`${dateTo}T23:59:59`).getTime();
      return matchesQuery && fromOk && toOk;
    });

    return [...rows].sort((a, b) => {
      if (sort === 'oldest') {
        return (
          new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
        );
      }
      if (sort === 'amount_high') return b.amount - a.amount;
      if (sort === 'amount_low') return a.amount - b.amount;
      return (
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
    });
  }, [query, sort, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, filtered.length);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const stats = WITHDRAWAL_STATS;

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
  }

  function exportCsv() {
    const header = [
      'Withdrawal ID',
      'User ID',
      'Receiver Name',
      'Amount',
      'Request Date',
      'Status',
    ];
    const lines = filtered.map(row =>
      [
        row.code,
        row.userId,
        row.receiverName,
        String(row.amount),
        row.requestDateLabel,
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
    link.download = 'withdrawals.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Withdrawal Request</h1>
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
                placeholder="Search Receiver Name..."
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className={styles.selectField}>
              <span>Sort</span>
              <select
                value={sort}
                onChange={event => {
                  setSort(event.target.value as WithdrawalSort);
                  setPage(1);
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount High → Low</option>
                <option value="amount_low">Amount Low → High</option>
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
                  <th>Receiver Name</th>
                  <th>Amount</th>
                  <th>Request date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No withdrawal requests match your filters.
                    </td>
                  </tr>
                ) : null}
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className={styles.code}>{row.userId}</td>
                    <td className={styles.strong}>{row.receiverName}</td>
                    <td>{formatInr(row.amount)}</td>
                    <td>{row.requestDateLabel}</td>
                    <td>
                      <Link
                        to={`/withdrawals/${row.id}`}
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
