import {useCallback, useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, MoreVertical, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {
  SupportTicketStatusBadge,
  TicketStatusBadge,
} from '../../components/tickets/TicketBadge/TicketBadge';
import {TicketDetailsModal} from '../../components/tickets/TicketDetailsModal/TicketDetailsModal';
import {SupportTicketDetailsModal} from '../../components/tickets/TicketDetailsModal/SupportTicketDetailsModal';
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
import {
  fetchSupportTicketStats,
  fetchSupportTickets,
  updateSupportTicketStatus,
  type SupportTicketItem,
  type SupportTicketStats,
  type SupportTicketStatus,
} from '../../api/supportTickets';
import styles from './TicketsPage.module.css';

const PAGE_SIZE = 10;
type Mode = 'support' | 'reports';

export function TicketsPage() {
  const [mode, setMode] = useState<Mode>('support');

  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>([]);
  const [supportStats, setSupportStats] = useState<SupportTicketStats | null>(
    null,
  );
  const [reportTickets, setReportTickets] = useState<TicketItem[]>([]);
  const [reportStats, setReportStats] = useState<TicketStats | null>(null);

  const [userType, setUserType] = useState<'caller' | 'receiver'>('caller');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [supportStatus, setSupportStatus] = useState<
    'all' | SupportTicketStatus
  >('all');
  const [reportStatus, setReportStatus] = useState<'all' | TicketStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(
    null,
  );
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
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
      if (mode === 'support') {
        const [listResult, statsResult] = await Promise.all([
          fetchSupportTickets({
            q: debouncedQuery || undefined,
            status: supportStatus === 'all' ? undefined : supportStatus,
            role: userType,
            page,
            limit: PAGE_SIZE,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
          }),
          fetchSupportTicketStats(),
        ]);
        setSupportTickets(listResult.tickets);
        setTotal(listResult.pagination.total);
        setTotalPages(listResult.pagination.totalPages);
        setSupportStats(statsResult.stats);
      } else {
        const [listResult, statsResult] = await Promise.all([
          fetchReports({
            q: debouncedQuery || undefined,
            status: reportStatus === 'all' ? undefined : reportStatus,
            userType,
            page,
            limit: PAGE_SIZE,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
          }),
          fetchReportStats(),
        ]);
        setReportTickets(listResult.tickets);
        setTotal(listResult.pagination.total);
        setTotalPages(listResult.pagination.totalPages);
        setReportStats(statsResult.stats);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load tickets.',
      );
    } finally {
      setLoading(false);
    }
  }, [
    mode,
    debouncedQuery,
    supportStatus,
    reportStatus,
    userType,
    page,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedSupport = selectedSupportId
    ? supportTickets.find(ticket => ticket.id === selectedSupportId) || null
    : null;
  const selectedReport = selectedReportId
    ? reportTickets.find(ticket => ticket.id === selectedReportId) || null
    : null;

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
    setMenuOpenId(null);
  }

  function onModeChange(next: Mode) {
    setMode(next);
    setPage(1);
    setMenuOpenId(null);
    setSelectedSupportId(null);
    setSelectedReportId(null);
    setActionError('');
  }

  function onTabChange(next: 'caller' | 'receiver') {
    setUserType(next);
    setPage(1);
    setMenuOpenId(null);
  }

  function patchSupport(next: SupportTicketItem) {
    setSupportTickets(current =>
      current.map(ticket => (ticket.id === next.id ? next : ticket)),
    );
  }

  function patchReport(next: TicketItem) {
    setReportTickets(current =>
      current.map(ticket => (ticket.id === next.id ? next : ticket)),
    );
  }

  async function handleSupportUpdate(input: {
    status: SupportTicketStatus;
    adminNote?: string;
  }) {
    if (!selectedSupport) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await updateSupportTicketStatus(
        selectedSupport.id,
        input,
      );
      patchSupport(result.ticket);
      setSelectedSupportId(null);
      void load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Failed to update ticket.',
      );
    } finally {
      setActionBusy(false);
    }
  }

  async function handleIgnore() {
    if (!selectedReport) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await ignoreReport(selectedReport.id);
      patchReport(result.ticket);
      setSelectedReportId(null);
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
    if (!selectedReport) return;
    const confirmed = window.confirm(
      `Terminate ${selectedReport.reportTo}? This will block/terminate their account.`,
    );
    if (!confirmed) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await terminateReport(
        selectedReport.id,
        `Terminated from report ${selectedReport.code}`,
      );
      patchReport(result.ticket);
      setSelectedReportId(null);
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
              {mode === 'support'
                ? 'Manage Contact Support tickets from callers and receivers.'
                : 'Review user reports from chat. Ignore or terminate as needed.'}
            </p>
          </div>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={[
                styles.modeTab,
                mode === 'support' ? styles.modeTabActive : '',
              ].join(' ')}
              onClick={() => onModeChange('support')}
            >
              Support Tickets
            </button>
            <button
              type="button"
              className={[
                styles.modeTab,
                mode === 'reports' ? styles.modeTabActive : '',
              ].join(' ')}
              onClick={() => onModeChange('reports')}
            >
              Chat Reports
            </button>
          </div>
        </header>

        <section className={styles.statGrid}>
          {mode === 'support' ? (
            <>
              <StatCard
                label="Total Tickets"
                value={(supportStats?.total ?? 0).toLocaleString('en-IN')}
                tone="dark"
              />
              <StatCard
                label="Open / In Review"
                value={supportStats?.open ?? 0}
                tone="gold"
              />
              <StatCard
                label="Solved / Closed"
                value={supportStats?.resolved ?? 0}
                tone="green"
              />
            </>
          ) : (
            <>
              <StatCard
                label="Total Reports"
                value={(reportStats?.total ?? 0).toLocaleString('en-IN')}
                tone="dark"
              />
              <StatCard
                label="Open Reports"
                value={reportStats?.open ?? 0}
                tone="gold"
              />
              <StatCard
                label="Resolved"
                value={reportStats?.resolved ?? 0}
                tone="green"
              />
            </>
          )}
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
                  placeholder={
                    mode === 'support'
                      ? 'Search support tickets...'
                      : 'Search reports...'
                  }
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
              </label>
              <label className={styles.selectField}>
                <span>Status</span>
                {mode === 'support' ? (
                  <select
                    value={supportStatus}
                    onChange={event => {
                      setSupportStatus(
                        event.target.value as 'all' | SupportTicketStatus,
                      );
                      setPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="solved">Solved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <select
                    value={reportStatus}
                    onChange={event => {
                      setReportStatus(
                        event.target.value as 'all' | TicketStatus,
                      );
                      setPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="ignored">Ignored</option>
                    <option value="resolved">Resolved</option>
                  </select>
                )}
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
                  {mode === 'support' ? (
                    <>
                      <th>User</th>
                      <th>Category</th>
                      <th>Subject</th>
                    </>
                  ) : (
                    <>
                      <th>Report By</th>
                      <th>Report To</th>
                      <th>Issue Type</th>
                    </>
                  )}
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="Loading tickets..." />
                    </td>
                  </tr>
                ) : mode === 'support' ? (
                  supportTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyCell}>
                        <EmptyTableState label="No support tickets match your filters." />
                      </td>
                    </tr>
                  ) : (
                    supportTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td className={styles.code}>{ticket.code}</td>
                        <td>{ticket.userName}</td>
                        <td>{ticket.category}</td>
                        <td>{ticket.subject}</td>
                        <td>
                          <SupportTicketStatusBadge status={ticket.status} />
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
                                    setSelectedSupportId(ticket.id);
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
                  )
                ) : reportTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="No reports match your filters." />
                    </td>
                  </tr>
                ) : (
                  reportTickets.map(ticket => (
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
                                  setSelectedReportId(ticket.id);
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

        {selectedSupport ? (
          <SupportTicketDetailsModal
            ticket={selectedSupport}
            busy={actionBusy}
            error={actionError}
            onClose={() => {
              setSelectedSupportId(null);
              setActionError('');
            }}
            onUpdateStatus={input => void handleSupportUpdate(input)}
          />
        ) : null}

        {selectedReport ? (
          <TicketDetailsModal
            ticket={selectedReport}
            busy={actionBusy}
            error={actionError}
            onClose={() => {
              setSelectedReportId(null);
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
