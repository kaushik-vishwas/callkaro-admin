import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {StatusBadge} from '../../components/callers/StatusBadge/StatusBadge';
import {VipBadge} from '../../components/callers/VipBadge/VipBadge';
import {
  fetchCallerStats,
  fetchCallers,
  formatInr,
  formatNumber,
  type AdminCallerListItem,
  type AdminCallerStats,
  type CallerStatus,
} from '../../api/callers';
import {ApiError} from '../../api/client';
import styles from './CallersPage.module.css';

type TabFilter = 'all' | 'vip' | CallerStatus;

const PAGE_SIZE = 15;

const tabs: Array<{id: TabFilter; label: string}> = [
  {id: 'all', label: 'All Users'},
  {id: 'vip', label: 'VIP Only'},
  {id: 'active', label: 'Active'},
  {id: 'blocked', label: 'Blocked'},
  {id: 'suspended', label: 'Suspended'},
];

export function CallersPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');
  const [rows, setRows] = useState<AdminCallerListItem[]>([]);
  const [stats, setStats] = useState<AdminCallerStats | null>(null);
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
        fetchCallers({
          q: debouncedQuery || undefined,
          tab,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchCallerStats(),
      ]);
      setRows(listResult.callers);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load callers.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, tab, page, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  function goToPage(next: number) {
    const clamped = Math.min(totalPages, Math.max(1, next));
    setPage(clamped);
    setJump(String(clamped));
  }

  const statCards = [
    {
      id: 'total',
      label: 'Total Callers',
      value: formatNumber(stats?.totalCallers || 0),
      tone: 'pink',
    },
    {
      id: 'active',
      label: 'Active Callers',
      value: formatNumber(stats?.activeCallers || 0),
      tone: 'green',
    },
    {
      id: 'vip',
      label: 'VIP Callers',
      value: formatNumber(stats?.vipCallers || 0),
      tone: 'gold',
    },
    {
      id: 'blocked',
      label: 'Blocked Callers',
      value: formatNumber(stats?.blockedCallers || 0),
      tone: 'red',
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: stats?.totalRevenueLabel || '₹ 0',
      tone: 'purple',
    },
    {
      id: 'avg',
      label: 'Avg Revenue/Caller',
      value: stats?.avgRevenueLabel || '₹ 0',
      tone: 'maroon',
    },
  ] as const;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>User Directory</h1>
            <p className={styles.subtitle}>
              Manage and monitor your enterprise user base.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div>
              <span className={styles.headerStatLabel}>Total Users</span>
              <strong className={styles.statPink}>
                {formatNumber(stats?.totalUsers || 0)}
              </strong>
            </div>
            <div>
              <span className={styles.headerStatLabel}>Active Now</span>
              <strong className={styles.statPurple}>
                {formatNumber(stats?.activeNow || 0)}
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.statGrid}>
          {statCards.map(card => (
            <article
              key={card.id}
              className={[styles.statCard, styles[`tone_${card.tone}`]].join(
                ' ',
              )}
            >
              <p className={styles.statLabel}>{card.label}</p>
              <p className={styles.statValue}>{card.value}</p>
            </article>
          ))}
        </div>

        <section className={styles.panel}>
          <div className={styles.filters}>
            <label className={styles.search}>
              <Search size={16} strokeWidth={2} />
              <input
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search User Directory..."
                aria-label="Search callers"
              />
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

          <div className={styles.tabsRow}>
            <div className={styles.tabs}>
              {tabs.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    styles.tab,
                    tab === item.id ? styles.tabActive : '',
                  ].join(' ')}
                  onClick={() => {
                    setTab(item.id);
                    setPage(1);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className={styles.showing}>
              Showing {start}–{end} of {formatNumber(total)}
            </p>
          </div>

          {error ? <p className={styles.errorBanner}>{error}</p> : null}
          {loading ? <p className={styles.loading}>Loading callers…</p> : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Caller</th>
                  <th>Caller ID</th>
                  <th>Phone</th>
                  <th>Reg Date</th>
                  <th>Coins</th>
                  <th>Total Recharge</th>
                  <th>Calls</th>
                  <th>VIP</th>
                  <th>Status</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={styles.empty}>
                      No callers found.
                    </td>
                  </tr>
                ) : null}
                {rows.map(caller => (
                  <tr key={caller.id}>
                    <td>
                      <Link
                        to={`/callers/${caller.id}`}
                        className={styles.callerCell}
                      >
                        <CallerAvatar name={caller.name} />
                        <span>{caller.name}</span>
                      </Link>
                    </td>
                    <td>{caller.code}</td>
                    <td>{caller.phone || '—'}</td>
                    <td>{caller.registeredAt}</td>
                    <td>{formatNumber(caller.coins)}</td>
                    <td>{formatInr(caller.totalRecharge)}</td>
                    <td>{caller.calls}</td>
                    <td>
                      <VipBadge vip={caller.vip} />
                    </td>
                    <td>
                      <StatusBadge status={caller.status} />
                    </td>
                    <td>{caller.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3]
                .filter(num => num <= totalPages)
                .map(num => (
                  <button
                    key={num}
                    type="button"
                    className={[
                      styles.pageBtn,
                      page === num ? styles.pageActive : '',
                    ].join(' ')}
                    onClick={() => goToPage(num)}
                  >
                    {num}
                  </button>
                ))}
              {totalPages > 3 ? (
                <>
                  <span className={styles.ellipsis}>…</span>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => goToPage(totalPages)}
                  >
                    {formatNumber(totalPages)}
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <form
              className={styles.jump}
              onSubmit={event => {
                event.preventDefault();
                goToPage(Number(jump) || 1);
              }}
            >
              <label>
                Jump to Page
                <input
                  value={jump}
                  onChange={event => setJump(event.target.value)}
                  inputMode="numeric"
                />
              </label>
              <button type="submit">Go</button>
            </form>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
