import {useMemo, useState} from 'react';
import {ChevronLeft, ChevronRight, MoreVertical, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {TicketStatusBadge} from '../../components/tickets/TicketBadge/TicketBadge';
import {TicketDetailsModal} from '../../components/tickets/TicketDetailsModal/TicketDetailsModal';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {
  TICKETS,
  TICKET_STATS,
  type TicketItem,
  type TicketStatus,
  type TicketUserType,
} from '../../data/tickets';
import styles from './TicketsPage.module.css';

const PAGE_SIZE = 5;

export function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(TICKETS);
  const [userType, setUserType] = useState<TicketUserType>('caller');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter(ticket => {
      if (ticket.userType !== userType) return false;
      if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;

      const matchesQuery =
        !q ||
        ticket.code.toLowerCase().includes(q) ||
        ticket.reportBy.toLowerCase().includes(q) ||
        ticket.reportTo.toLowerCase().includes(q) ||
        ticket.issueType.toLowerCase().includes(q);

      const created = new Date(ticket.createdAt).getTime();
      const fromOk = !dateFrom || created >= new Date(dateFrom).getTime();
      const toOk =
        !dateTo || created <= new Date(`${dateTo}T23:59:59`).getTime();

      return matchesQuery && fromOk && toOk;
    });
  }, [tickets, userType, query, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selected = selectedId
    ? tickets.find(ticket => ticket.id === selectedId) || null
    : null;

  const stats = TICKET_STATS;

  function goToPage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
    setMenuOpenId(null);
  }

  function onTabChange(next: TicketUserType) {
    setUserType(next);
    setPage(1);
    setMenuOpenId(null);
  }

  return (
    <DashboardShell>
      <div className={styles.page} onClick={() => setMenuOpenId(null)}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Tickets</h1>
            <p className={styles.subtitle}>
              Manage and resolve customer support tickets.
            </p>
          </div>
        </header>

        <section className={styles.statGrid}>
          <StatCard
            label="Total Tickets"
            value={stats.total.toLocaleString('en-IN')}
            tone="dark"
          />
          <StatCard label="Open Tickets" value={stats.open} tone="gold" />
          <StatCard label="Resolved" value={stats.resolved} tone="green" />
        </section>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              {(
                [
                  ['caller', 'Caller'],
                  ['receiver', 'Receiver'],
                  ['agent', 'Agent'],
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
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <EmptyTableState label="No tickets match your filters." />
                    </td>
                  </tr>
                ) : null}
                {rows.map(ticket => (
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
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <p className={styles.showing}>
              Showing {start} to {end} of {filtered.length} tickets
            </p>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
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
            onClose={() => setSelectedId(null)}
            onSave={({status, assignedToAdmin}) => {
              setTickets(current =>
                current.map(ticket =>
                  ticket.id === selected.id
                    ? {...ticket, status, assignedToAdmin}
                    : ticket,
                ),
              );
              setSelectedId(null);
            }}
          />
        ) : null}
      </div>
    </DashboardShell>
  );
}
