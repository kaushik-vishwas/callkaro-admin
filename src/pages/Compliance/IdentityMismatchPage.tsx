import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Download, Eye, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ComplianceSubnav} from '../../components/compliance/ComplianceSubnav/ComplianceSubnav';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchComplianceCases,
  fetchComplianceStats,
  type ComplianceCase,
  type IdentityStats,
} from '../../api/compliance';
import styles from './Compliance.module.css';

const PAGE_SIZE = 10;

const EMPTY_STATS: IdentityStats = {
  total: 0,
  pending: 0,
  assigned: 0,
  highRisk: 0,
  underAppeal: 0,
  banned: 0,
};

export function IdentityMismatchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ComplianceCase[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<IdentityStats>(EMPTY_STATS);
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
        fetchComplianceCases({
          source: 'identity_mismatch',
          q: debouncedQuery || undefined,
          status,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchComplianceStats('identity_mismatch'),
      ]);
      setRows(listResult.cases);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load cases.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, status, page, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  function exportCsv() {
    const header = [
      'Case ID',
      'Report Date',
      'Receiver',
      'Caller',
      'Source',
      'Agent',
      'Status',
    ];
    const lines = rows.map(row =>
      [
        row.caseCode,
        row.reportDateLabel,
        row.receiverName,
        row.callerName,
        row.detectionSource,
        row.assignedAgentName || 'Unassigned',
        row.statusLabel,
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
    link.download = 'identity-mismatch-cases.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <DashboardShell>
      <div className={styles.page}>
        <ComplianceSubnav />
        <p className={styles.breadcrumb}>
          Compliance & Moderation &gt; Identity Mismatch
        </p>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Identity Mismatch Cases</h1>
            <p className={styles.subtitle}>
              Review and investigate caller-reported identity mismatch
              incidents.
            </p>
          </div>
          <button type="button" className={styles.exportBtn} onClick={exportCsv}>
            <Download size={15} />
            Export Data
          </button>
        </header>

        <section className={[styles.statGrid, styles.statGridWide].join(' ')}>
          <StatCard label="Total Cases" value={String(stats.total)} tone="pink" />
          <StatCard
            label="Pending Review"
            value={String(stats.pending)}
            tone="amber"
          />
          <StatCard
            label="Assigned"
            value={String(stats.assigned)}
            tone="blue"
          />
          <StatCard
            label="High Risk Cases"
            value={String(stats.highRisk)}
            tone="red"
          />
          <StatCard
            label="Under Appeal"
            value={String(stats.underAppeal)}
            tone="amber"
          />
          <StatCard
            label="Banned Receivers"
            value={String(stats.banned)}
            tone="red"
          />
        </section>

        {error ? <p className={styles.emptyCell}>{error}</p> : null}

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search size={16} />
              <input
                type="search"
                placeholder="Search Receiver / Caller Name..."
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
                  setStatus(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending Review</option>
                <option value="assigned">Assigned</option>
                <option value="agent_accepted">Agent Accepted</option>
                <option value="agent_ignored">Agent Ignored</option>
                <option value="closed">Closed</option>
                <option value="under_appeal">Under Appeal</option>
                <option value="blocked">Blocked</option>
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

          <h2 className={styles.panelTitle}>
            Identity Mismatch Cases ({total} results)
          </h2>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Report Date</th>
                  <th>Receiver Name</th>
                  <th>Caller Name</th>
                  <th>Detection Source</th>
                  <th>Assigned Agent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      Loading cases…
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      <EmptyTableState label="No identity mismatch cases yet." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? rows.map(row => (
                      <tr key={row.id}>
                        <td className={styles.code}>{row.caseCode}</td>
                        <td>{row.reportDateLabel}</td>
                        <td>
                          <div>{row.receiverName}</div>
                          {row.receiverPriorViolations > 0 ? (
                            <div className={styles.muted}>
                              {row.receiverPriorViolations} prior violation
                              {row.receiverPriorViolations === 1 ? '' : 's'}
                            </div>
                          ) : null}
                        </td>
                        <td>{row.callerName}</td>
                        <td>{row.detectionSource}</td>
                        <td>{row.assignedAgentName || 'Unassigned'}</td>
                        <td>
                          <span
                            className={[styles.badge, styles[row.status]].join(
                              ' ',
                            )}
                          >
                            {row.statusLabel}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/compliance/identity-mismatch/${row.id}`}
                            className={styles.viewBtn}
                          >
                            <Eye size={15} />
                            Review Case
                          </Link>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <p className={styles.muted}>
              Showing {start} of {total} cases
            </p>
            <div className={styles.pages}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
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
                      number === page ? styles.pageActive : '',
                    ].join(' ')}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
