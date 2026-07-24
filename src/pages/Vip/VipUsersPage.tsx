import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Download, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {
  formatInr,
  formatNumber,
  VIP_DIRECTORY_STATS,
  VIP_USERS,
  type VipUserStatus,
} from '../../data/vip';
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

function statusLabel(status: VipUserStatus) {
  if (status === 'active') return 'ACTIVE';
  if (status === 'blocked') return 'BLOCKED';
  return 'SUSPENDED';
}

export function VipUsersPage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabFilter>('vip');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIP_USERS.filter(user => {
      if (tab === 'active' || tab === 'blocked' || tab === 'suspended') {
        if (user.status !== tab) return false;
      }
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.code.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q)
      );
    });
  }, [query, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const stats = VIP_DIRECTORY_STATS;

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
    const lines = filtered.map(row =>
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
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={styles.empty}>
                      No VIP users match your filters.
                    </td>
                  </tr>
                ) : null}
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/vip/users/${row.id}`} className={styles.userLink}>
                        <span className={styles.avatar}>
                          {row.name.slice(0, 1)}
                        </span>
                        <span className={styles.strong}>{row.name}</span>
                      </Link>
                    </td>
                    <td className={styles.code}>{row.code}</td>
                    <td>{row.phone}</td>
                    <td>{row.regDate}</td>
                    <td>{formatNumber(row.coins)}</td>
                    <td>{formatInr(row.totalRecharge)}</td>
                    <td>{formatNumber(row.calls)}</td>
                    <td>
                      <span className={styles.vipBadge}>VIP</span>
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
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
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
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
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
