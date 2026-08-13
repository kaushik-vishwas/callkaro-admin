import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Download, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchVipUsers,
  formatInr,
  formatNumber,
  type VipDirectoryStats,
  type VipUser,
  type VipUserStatus,
} from '../../api/vip';
import styles from './VipUsersPage.module.css';

type TabFilter = 'all' | 'vip' | VipUserStatus;

const PAGE_SIZE = 10;

const tabs: Array<{id: TabFilter; label: string}> = [
  {id: 'all', label: 'All Users'},
  {id: 'vip', label: 'VIP Only'},
  {id: 'active', label: 'Active'},
  {id: 'blocked', label: 'Blocked'},
  {id: 'suspended', label: 'Suspended'},
];

const EMPTY_STATS: VipDirectoryStats = {
  totalCallers: 0,
  activeCallers: 0,
  vipCallers: 0,
  totalRevenueLabel: '₹ 0',
  avgRevenueLabel: '₹ 0',
};

function statusLabel(status: VipUserStatus) {
  if (status === 'active') return 'ACTIVE';
  if (status === 'blocked') return 'BLOCKED';
  return 'SUSPENDED';
}

export function VipUsersPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tab, setTab] = useState<TabFilter>('vip');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');
  const [users, setUsers] = useState<VipUser[]>([]);
  const [stats, setStats] = useState<VipDirectoryStats>(EMPTY_STATS);
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
      const result = await fetchVipUsers({
        q: debouncedQuery || undefined,
        tab,
        page,
        limit: PAGE_SIZE,
      });
      setUsers(result.users || []);
      setStats(result.stats || EMPTY_STATS);
      setTotal(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load VIP users.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, tab, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, total);

  function goToPage(next: number) {
    const clamped = Math.min(totalPages, Math.max(1, next));
    setPage(clamped);
    setJump(String(clamped));
  }

  function exportCsv() {
    const header = [
      'Name',
      'Caller ID',
      'Phone',
      'Reg Date',
      'Coins',
      'Total Recharge',
      'Calls',
      'VIP Plan',
      'Status',
      'Last Active',
    ];
    const lines = users.map(row =>
      [
        row.name,
        row.code,
        row.phone,
        row.regDate,
        String(row.coins),
        String(row.totalRecharge),
        String(row.calls),
        row.vipPlan,
        row.status,
        row.lastActive,
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
    link.download = 'vip-users.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>VIP User Directory</h1>
            <p className={styles.subtitle}>
              Manage and monitor your enterprise user base.
            </p>
          </div>
          <div className={styles.headerRight}>
            <VipSubnav />
            <button type="button" className={styles.exportBtn} onClick={exportCsv}>
              <Download size={15} />
              Export Data
            </button>
          </div>
        </header>

        {error ? <p className={styles.subtitle}>{error}</p> : null}

        <section className={styles.statGrid}>
          <StatCard
            label="Total Callers"
            value={formatNumber(stats.totalCallers)}
            tone="pink"
          />
          <StatCard
            label="Active Callers"
            value={formatNumber(stats.activeCallers)}
            tone="green"
          />
          <StatCard
            label="VIP Callers"
            value={formatNumber(stats.vipCallers)}
            tone="gold"
          />
          <StatCard
            label="Total Revenue"
            value={stats.totalRevenueLabel}
            tone="purple"
          />
          <StatCard
            label="Avg. Revenue / Caller"
            value={stats.avgRevenueLabel}
            tone="blue"
          />
        </section>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
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
                    setJump('1');
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className={styles.search}>
              <Search size={16} />
              <input
                type="search"
                placeholder="Search users by name, ID or mobile..."
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setPage(1);
                  setJump('1');
                }}
              />
            </label>
          </div>

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
                {loading ? (
                  <tr>
                    <td colSpan={10} className={styles.empty}>
                      <EmptyTableState label="Loading VIP users..." />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={styles.empty}>
                      No VIP users match your filters.
                    </td>
                  </tr>
                ) : (
                  users.map(row => (
                    <tr key={row.id}>
                      <td>
                        <Link
                          to={`/vip/users/${row.id}`}
                          className={styles.userLink}
                        >
                          <span className={styles.avatar}>
                            {row.name.slice(0, 1)}
                          </span>
                          <span className={styles.strong}>{row.name}</span>
                        </Link>
                      </td>
                      <td className={styles.code}>{row.code}</td>
                      <td>{row.phone || '—'}</td>
                      <td>{row.regDate}</td>
                      <td>{formatNumber(row.coins)}</td>
                      <td>{formatInr(row.totalRecharge)}</td>
                      <td>{formatNumber(row.calls)}</td>
                      <td>
                        <span className={styles.vipBadge}>
                          {row.vipPlan || 'VIP'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={[
                            styles.status,
                            styles[`status_${row.status}`],
                          ].join(' ')}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td>{row.lastActive}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
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
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1)
                .slice(0, 8)
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
                <ChevronRight size={16} />
              </button>
            </div>
            <label className={styles.jump}>
              Jump to Page
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jump}
                onChange={event => setJump(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    goToPage(Number(jump) || 1);
                  }
                }}
              />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
