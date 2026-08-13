import {useCallback, useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
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
  fetchWithdrawalStats,
  fetchWithdrawals,
} from '../../api/withdrawals';
import {
  formatInr,
  formatNumber,
  type WithdrawalItem,
  type WithdrawalSort,
  type WithdrawalStats,
  type WithdrawalStatus,
} from '../../data/withdrawals';
import styles from './WithdrawalsPage.module.css';

const PAGE_SIZES = [10, 25, 50];

const EMPTY_STATS: WithdrawalStats = {
  totalTransactions: 0,
  vipPurchases: 0,
  totalRevenue: 0,
  totalRevenueLabel: '₹ 0',
};

function statusLabel(status: WithdrawalStatus) {
  if (status === 'pending') return 'Pending';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Successful';
}

export function WithdrawalsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery =
    searchParams.get('q') ||
    searchParams.get('receiverId') ||
    searchParams.get('agentId') ||
    '';
  const initialReceiverId = searchParams.get('receiverId') || '';
  const initialAgentId = searchParams.get('agentId') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());
  const [receiverId] = useState(initialReceiverId);
  const [agentId] = useState(initialAgentId);
  const [status, setStatus] = useState<'all' | WithdrawalStatus>('all');
  const [sort, setSort] = useState<WithdrawalSort>('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState<WithdrawalItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<WithdrawalStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const next =
      searchParams.get('q') ||
      searchParams.get('receiverId') ||
      searchParams.get('agentId') ||
      '';
    setQuery(next);
    setDebouncedQuery(next.trim());
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        fetchWithdrawals({
          q: debouncedQuery || undefined,
          receiverId: receiverId || undefined,
          agentId: agentId || undefined,
          status,
          sort,
          page,
          limit: pageSize,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchWithdrawalStats(),
      ]);
      setRows(listResult.withdrawals);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Failed to load withdrawals.',
      );
    } finally {
      setLoading(false);
    }
  }, [
    debouncedQuery,
    receiverId,
    agentId,
    status,
    sort,
    page,
    pageSize,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
  }

  async function exportCsv() {
    setExporting(true);
    try {
      const result = await fetchWithdrawals({
        q: debouncedQuery || undefined,
        receiverId: receiverId || undefined,
        agentId: agentId || undefined,
        status,
        sort,
        page: 1,
        limit: 500,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      const header = [
        'Withdrawal ID',
        'User ID',
        'Receiver Name',
        'Amount',
        'Fee',
        'Net',
        'Request Date',
        'Status',
        'UTR',
      ];
      const lines = result.withdrawals.map(row =>
        [
          row.code,
          row.userId,
          row.receiverName,
          String(row.amount),
          String(row.feeInr || 0),
          String(row.netInr || 0),
          row.requestDateLabel,
          row.status,
          row.utr || '',
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
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to export withdrawals.',
      );
    } finally {
      setExporting(false);
    }
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
          <button
            type="button"
            className={styles.exportBtn}
            onClick={() => void exportCsv()}
            disabled={exporting}
          >
            <Download size={15} />
            {exporting ? 'Exporting…' : 'Export Data'}
          </button>
        </header>

        {error ? <p className={styles.emptyCell}>{error}</p> : null}

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
              <span>Status</span>
              <select
                value={status}
                onChange={event => {
                  setStatus(event.target.value as 'all' | WithdrawalStatus);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="successful">Successful</option>
                <option value="rejected">Rejected</option>
              </select>
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      Loading withdrawals…
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      <EmptyTableState label="No withdrawal requests match your filters." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? rows.map(row => (
                      <tr key={row.id}>
                        <td className={styles.code}>{row.userId}</td>
                        <td className={styles.strong}>{row.receiverName}</td>
                        <td>{formatInr(row.amount)}</td>
                        <td>{row.requestDateLabel}</td>
                        <td>
                          <span className={styles[`status_${row.status}`] || ''}>
                            {statusLabel(row.status)}
                          </span>
                        </td>
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
