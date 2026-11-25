import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {
  fetchIdleReceivers,
  type DashboardRange,
  type IdleReceiversPage,
} from '../../../api/dashboard';
import {RangeFilter} from '../RangeFilter/RangeFilter';
import styles from './IdleReceiversProfile.module.css';

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export function IdleReceiversProfile() {
  const [range, setRange] = useState<DashboardRange>(7);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IdleReceiversPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reqId = useRef(0);

  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    fetchIdleReceivers(range, page)
      .then(res => {
        if (id !== reqId.current) return;
        setData(res);
        // Server clamps out-of-range pages; follow it.
        if (res.page !== page) setPage(res.page);
      })
      .catch(err => {
        if (id !== reqId.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
  }, [range, page, reloadKey]);

  const changeRange = (days: DashboardRange) => {
    setRange(days);
    setPage(1);
  };

  const rows = data?.receivers || [];
  const total = data?.total || 0;
  const pageSize = data?.pageSize || 10;
  const totalPages = data?.totalPages || 1;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Idle Receivers Profile</h2>
          <p className={styles.subtitle}>
            Idle time = online time − call time · most idle first
          </p>
        </div>
        <RangeFilter
          label="Idle receivers profile date range"
          value={range}
          loading={loading}
          onChange={changeRange}
        />
      </div>

      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey(k => k + 1)}>
            Retry
          </button>
        </div>
      ) : !data && loading ? (
        <div className={styles.empty}>
          <p>Loading idle receivers…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>
          <p>No idle receivers in this period.</p>
        </div>
      ) : (
        <>
          <div className={`${styles.tableWrap} ${loading ? styles.stale : ''}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.rankCol}>#</th>
                  <th>Receiver</th>
                  <th>Level</th>
                  <th className={styles.num}>Online</th>
                  <th className={styles.num}>On Call</th>
                  <th className={styles.num}>Idle</th>
                  <th className={styles.num}>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td className={styles.rankCol}>{r.rank}</td>
                    <td>
                      <Link to={`/receivers/${r.id}`} className={styles.person}>
                        <span className={styles.avatar}>
                          {r.avatarUrl ? (
                            <img src={r.avatarUrl} alt="" loading="lazy" />
                          ) : (
                            r.name.charAt(0).toUpperCase()
                          )}
                          {r.isOnline ? (
                            <i className={styles.onlineDot} aria-label="Online now" />
                          ) : null}
                        </span>
                        <span className={styles.personText}>
                          <strong>{r.name}</strong>
                          <small>
                            {r.age ? `${r.age} yrs · ` : ''}
                            {r.isOnline ? 'Online now' : 'Offline'}
                          </small>
                        </span>
                      </Link>
                    </td>
                    <td>{r.level ? `L${r.level}` : '—'}</td>
                    <td className={styles.num}>{formatMinutes(r.onlineMinutes)}</td>
                    <td className={styles.num}>{formatMinutes(r.callMinutes)}</td>
                    <td className={`${styles.num} ${styles.idle}`}>
                      {formatMinutes(r.idleMinutes)}
                    </td>
                    <td className={styles.num}>
                      <span className={styles.util}>
                        <span className={styles.utilBar}>
                          <span style={{width: `${Math.min(100, r.utilizationPct)}%`}} />
                        </span>
                        {r.utilizationPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pager}>
            <p className={styles.pagerInfo}>
              Showing {from}–{to} of {total.toLocaleString('en-IN')}
            </p>
            {totalPages > 1 ? (
              <nav className={styles.pages} aria-label="Idle receivers pages">
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(p => p - 1)}
                  aria-label="Previous page">
                  <ChevronLeft size={16} strokeWidth={2.25} />
                </button>
                {pageList(page, totalPages).map((p, i) =>
                  p === '…' ? (
                    <span key={`gap-${i}`} className={styles.gap}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`}
                      aria-current={p === page ? 'page' : undefined}
                      disabled={loading && p !== page}
                      onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(p => p + 1)}
                  aria-label="Next page">
                  <ChevronRight size={16} strokeWidth={2.25} />
                </button>
              </nav>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
