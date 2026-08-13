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
  type DetectedStats,
} from '../../api/compliance';
import styles from './Compliance.module.css';

const PAGE_SIZE = 10;

const EMPTY_STATS: DetectedStats = {
  total: 0,
  pending: 0,
  blockedToday: 0,
};

export function DetectedProfilesPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [source, setSource] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ComplianceCase[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<DetectedStats>(EMPTY_STATS);
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
          source: 'detected',
          q: debouncedQuery || undefined,
          detectionSource: source,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchComplianceStats('detected'),
      ]);
      setRows(listResult.cases);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load detections.',
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, source, page, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  function exportCsv() {
    const header = [
      'Case ID',
      'Detection Date',
      'Detection Type',
      'Caller',
      'Receiver',
      'Source',
      'Status',
    ];
    const lines = rows.map(row =>
      [
        row.caseCode,
        row.reportDateLabel,
        row.detectionType,
        row.callerName,
        row.receiverName,
        row.sourceLabel,
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
    link.download = 'detected-profiles.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <ComplianceSubnav />
        <p className={styles.breadcrumb}>
          Compliance & Moderation &gt; Detected Profiles
        </p>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Detected Profiles</h1>
            <p className={styles.subtitle}>
              Review general reports from callers and receivers (chat and
              in-call).
            </p>
          </div>
          <button type="button" className={styles.exportBtn} onClick={exportCsv}>
            <Download size={15} />
            Export Data
          </button>
        </header>

        <section className={styles.statGrid}>
          <StatCard
            label="Total Detections"
            value={String(stats.total)}
            tone="pink"
          />
          <StatCard
            label="Pending Review"
            value={String(stats.pending)}
            tone="amber"
          />
          <StatCard
            label="Blocked Today"
            value={String(stats.blockedToday)}
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
                placeholder="Search Receiver Name..."
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className={styles.selectField}>
              <span>Source</span>
              <select
                value={source}
                onChange={event => {
                  setSource(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Sources</option>
                <option value="Chat">Chat</option>
                <option value="Video Call">Video Call</option>
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

          <h2 className={styles.panelTitle}>Flagged Cases</h2>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Detection Date</th>
                  <th>Detection Type</th>
                  <th>Caller Name</th>
                  <th>Receiver Name</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      Loading detections…
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      <EmptyTableState label="No general reports yet." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? rows.map(row => (
                      <tr key={row.id}>
                        <td className={styles.code}>{row.caseCode}</td>
                        <td>{row.reportDateLabel}</td>
                        <td>{row.detectionType}</td>
                        <td>{row.callerName}</td>
                        <td>{row.receiverName}</td>
                        <td>{row.sourceLabel}</td>
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
                            to={`/compliance/detected-profiles/${row.id}`}
                            className={styles.viewBtn}
                          >
                            <Eye size={15} />
                            View Details
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
