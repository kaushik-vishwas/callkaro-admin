import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {AgentStatusBadge} from '../../components/agents/AgentStatusBadge/AgentStatusBadge';
import {CreateAgentModal} from '../../components/agents/CreateAgentModal/CreateAgentModal';
import {
  fetchAgentStats,
  fetchAgents,
  formatInr,
  formatNumber,
  type AdminAgentListItem,
  type AdminAgentStats,
  type AgentStatus,
  updateAgent,
} from '../../api/agents';
import {ApiError} from '../../api/client';
import styles from './AgentsPage.module.css';

type TabFilter = 'all' | AgentStatus | 'high' | 'commission';

const PAGE_SIZE = 10;

const tabs: Array<{id: TabFilter; label: string}> = [
  {id: 'all', label: 'All'},
  {id: 'active', label: 'Active'},
  {id: 'inactive', label: 'Inactive'},
  {id: 'high', label: 'High Revenue'},
  {id: 'commission', label: 'Top Commission'},
];

export function AgentsPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');
  const [rows, setRows] = useState<AdminAgentListItem[]>([]);
  const [stats, setStats] = useState<AdminAgentStats | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        fetchAgents({
          q: debouncedQuery || undefined,
          tab,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchAgentStats(),
      ]);
      setRows(listResult.agents);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load agents.',
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

  async function deactivateAgent(agent: AdminAgentListItem) {
    const okConfirm = window.confirm(
      `Deactivate ${agent.name}? They will no longer be able to sign in.`,
    );
    if (!okConfirm) return;
    try {
      await updateAgent(agent.id, {isActive: false});
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update agent.',
      );
    }
  }

  const statCards = [
    {
      id: 'total',
      label: 'Total Agents',
      value: formatNumber(stats?.totalAgents || 0),
      tone: 'pink',
    },
    {
      id: 'active',
      label: 'Active Agents',
      value: formatNumber(stats?.activeAgents || 0),
      tone: 'green',
    },
    {
      id: 'top',
      label: 'Top Performing',
      value: formatNumber(stats?.topPerforming || 0),
      tone: 'amber',
    },
    {
      id: 'commission',
      label: 'Total Commission',
      value: stats?.totalCommissionLabel || '₹ 0',
      tone: 'pink',
    },
    {
      id: 'revenue',
      label: 'Revenue via Agents',
      value: stats?.revenueViaAgentsLabel || '₹ 0',
      tone: 'purple',
    },
  ] as const;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Agent Management</h1>
            <p className={styles.subtitle}>
              Manage all agents and their performance.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.createBtn}
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Agent
            </button>
            <button type="button" className={styles.exportBtn}>
              <Download size={16} strokeWidth={2.25} />
              Export Data
            </button>
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
                placeholder="Search Agent Management"
                aria-label="Search agents"
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
          {loading ? <p className={styles.loading}>Loading agents…</p> : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Agent ID</th>
                  <th>Receivers</th>
                  <th>Revenue</th>
                  <th>Commission</th>
                  <th>Pending</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.empty}>
                      No agents found. Create one to get started.
                    </td>
                  </tr>
                ) : null}
                {rows.map(agent => (
                  <tr key={agent.id}>
                    <td>
                      <Link
                        to={`/agents/${agent.id}`}
                        className={styles.personCell}
                      >
                        <CallerAvatar name={agent.name} />
                        <span>{agent.name}</span>
                      </Link>
                    </td>
                    <td>{agent.code}</td>
                    <td>{agent.receivers}</td>
                    <td>{formatInr(agent.revenue)}</td>
                    <td className={styles.earnings}>
                      {formatInr(agent.commission)}
                    </td>
                    <td>{formatInr(agent.pending)}</td>
                    <td className={styles.rank}>#{agent.rank}</td>
                    <td>
                      <AgentStatusBadge status={agent.status} />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/agents/${agent.id}`}
                          className={styles.iconBtn}
                          title="View"
                          aria-label={`View ${agent.name}`}
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/agents/${agent.id}`}
                          className={styles.iconBtn}
                          title="Edit"
                          aria-label={`Edit ${agent.name}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          className={styles.iconBtnDanger}
                          title="Deactivate"
                          aria-label={`Deactivate ${agent.name}`}
                          onClick={() => void deactivateAgent(agent)}
                          disabled={agent.status === 'inactive'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
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

      <CreateAgentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setPage(1);
          void load();
        }}
      />
    </DashboardShell>
  );
}
