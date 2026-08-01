import {useCallback, useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, MoreVertical, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {TicketStatusBadge} from '../../components/tickets/TicketBadge/TicketBadge';
import {TicketDetailsModal} from '../../components/tickets/TicketDetailsModal/TicketDetailsModal';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchReportStats,
  fetchReports,
  ignoreReport,
  terminateReport,
  type TicketItem,
  type TicketStats,
  type TicketStatus,
  type TicketUserType,
} from '../../api/reports';
import styles from './TicketsPage.module.css';

const PAGE_SIZE = 10;

export function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [userType, setUserType] = useState<'all' | TicketUserType>('caller');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        fetchReports({
          q: debouncedQuery || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
          userType:
            userType === 'all' || userType === 'agent' ? undefined : userType,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchReportStats(),
      ]);
      setTickets(listResult.tickets);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, statusFilter, userType, page, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = selectedId
    ? tickets.find(ticket => ticket.id === selectedId) || null
    : null;

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
    setMenuOpenId(null);
  }

  function onTabChange(next: 'all' | TicketUserType) {
    setUserType(next);
    setPage(1);
    setMenuOpenId(null);
  }

  function patchTicket(next: TicketItem) {
    setTickets(current =>
      current.map(ticket => (ticket.id === next.id ? next : ticket)),
    );
  }

  async function handleIgnore() {
    if (!selected) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await ignoreReport(selected.id);
      patchTicket(result.ticket);
      setSelectedId(null);
      void load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Failed to ignore report.',
      );
    } finally {
      setActionBusy(false);
    }
  }

  async function handleTerminate() {
    if (!selected) return;
    const confirmed = window.confirm(
      `Terminate ${selected.reportTo}? This will block/terminate their account.`,
    );
    if (!confirmed) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await terminateReport(
        selected.id,
        `Terminated from report ${selected.code}`,
      );
      patchTicket(result.ticket);
      setSelectedId(null);
      void load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Failed to terminate user.',
      );
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page} onClick={() => setMenuOpenId(null)}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Tickets</h1>
            <p className={styles.subtitle}>
              Review user reports from chat. Ignore or terminate as needed.
            </p>
          </div>
        </header>

        <section className={styles.statGrid}>
          <StatCard
            label="Total Tickets"
            value={(stats?.total ?? 0).toLocaleString('en-IN')}
            tone="dark"
          />
          <StatCard label="Open Tickets" value={stats?.open ?? 0} tone="gold" />
          <StatCard
            label="Resolved"
            value={stats?.resolved ?? 0}
            tone="green"
          />
        </section>

        {error ? <p className={styles.subtitle}>{error}</p> : null}

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              {(
                [
                  ['caller', 'Caller'],
                  ['receiver', 'Receiver'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={[
                    styles.tab,
                    userType === id ? styles.tabActive : '',
                  ].join(' ')}
                  onClick={() => onTabChange(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.filters}>
              <label className={styles.search}>
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search Tickets..."
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
                  value={statusFilter}
                  onChange={event => {
                    setStatusFilter(event.target.value as 'all' | TicketStatus);
                    setPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="ignored">Ignored</option>
                  <option value="resolved">Resolved</option>
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
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Report By</th>
                  <th>Report To</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="Loading reports..." />
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="No tickets match your filters." />
                    </td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td className={styles.code}>{ticket.code}</td>
                      <td>{ticket.reportBy}</td>
                      <td>{ticket.reportTo}</td>
                      <td>{ticket.issueType}</td>
                      <td>
                        <TicketStatusBadge status={ticket.status} />
                      </td>
                      <td>{ticket.createdLabel}</td>
                      <td>
                        <div className={styles.actionWrap}>
                          <button
                            type="button"
                            className={styles.menuBtn}
                            aria-label={`Actions for ${ticket.code}`}
                            onClick={event => {
                              event.stopPropagation();
                              setMenuOpenId(current =>
                                current === ticket.id ? null : ticket.id,
                              );
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {menuOpenId === ticket.id ? (
                            <div
                              className={styles.menu}
                              role="menu"
                              onClick={event => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setActionError('');
                                  setSelectedId(ticket.id);
                                  setMenuOpenId(null);
                                }}
                              >
                                View details
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <p className={styles.showing}>
              Showing {start} to {end} of {total} tickets
            </p>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({length: totalPages}, (_, index) => index + 1)
                .slice(0, 5)
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
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {selected ? (
          <TicketDetailsModal
            ticket={selected}
            busy={actionBusy}
            error={actionError}
            onClose={() => {
              setSelectedId(null);
              setActionError('');
            }}
            onIgnore={() => void handleIgnore()}
            onTerminate={() => void handleTerminate()}
          />
        ) : null}
      </div>
    </DashboardShell>
  );
}
