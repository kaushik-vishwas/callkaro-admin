import {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Eye, Filter, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {
  fetchPendingReceivers,
  type PendingReceiverRow,
} from '../../api/receivers';
import {ApiError} from '../../api/client';
import styles from './VerificationPage.module.css';

export function VerificationPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [pending, setPending] = useState<PendingReceiverRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchPendingReceivers();
        if (!cancelled) setPending(data.pending);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'Failed to load pending approvals.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = pending.filter(
      row =>
        !normalized ||
        row.name.toLowerCase().includes(normalized) ||
        row.id.toLowerCase().includes(normalized) ||
        (row.agentName || '').toLowerCase().includes(normalized),
    );
    const order = [...filtered];
    if (sort === 'oldest') order.reverse();
    return order;
  }, [pending, query, sort]);

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Pending Approvals</h1>
            <p className={styles.subtitle}>
              Review and approve receiver profiles submitted by agents
            </p>
          </div>
          <div className={styles.countChip}>
            <span>Pending</span>
            <strong>{pending.length}</strong>
          </div>
        </header>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search} htmlFor="pending-search">
              <Search size={16} />
              <input
                id="pending-search"
                type="search"
                placeholder="Search receivers or agents..."
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </label>
            <label className={styles.filter} htmlFor="pending-sort">
              <Filter size={16} />
              <select
                id="pending-sort"
                value={sort}
                onChange={event =>
                  setSort(event.target.value as 'newest' | 'oldest')
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Agent</th>
                  <th>Photos</th>
                  <th>Level</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No pending approvals right now.
                    </td>
                  </tr>
                ) : null}
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div className={styles.receiverCell}>
                        <CallerAvatar name={row.name} size="sm" />
                        <span>
                          <span className={styles.receiverName}>{row.name}</span>
                          <span className={styles.receiverId}>ID: {row.id}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.meta}>{row.agentName || '—'}</span>
                      {row.agentCode ? (
                        <span className={styles.receiverId}>{row.agentCode}</span>
                      ) : null}
                    </td>
                    <td>
                      <span className={styles.meta}>
                        {row.photoCount} photos
                      </span>
                    </td>
                    <td>
                      <span className={styles.level}>Level {row.level}</span>
                    </td>
                    <td>
                      <span className={styles.meta}>{row.submittedAgo}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.reviewBtn}
                        onClick={() => navigate(`/receivers/${row.id}/kyc`)}
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
