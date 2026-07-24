import {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Download, Search} from 'lucide-react';
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
  const [agentFilter, setAgentFilter] = useState('all');
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
              : 'Failed to load pending verification.',
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

  const agents = useMemo(() => {
    const map = new Map<string, string>();
    pending.forEach(row => {
      if (row.agentId || row.agentName) {
        map.set(row.agentId || row.agentName || '', row.agentName || '—');
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({id, name}));
  }, [pending]);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = pending.filter(row => {
      const matchesQuery =
        !normalized ||
        row.name.toLowerCase().includes(normalized) ||
        row.id.toLowerCase().includes(normalized) ||
        (row.agentName || '').toLowerCase().includes(normalized);
      const matchesAgent =
        agentFilter === 'all' ||
        row.agentId === agentFilter ||
        row.agentName === agentFilter;
      return matchesQuery && matchesAgent;
    });
    const order = [...filtered];
    if (sort === 'oldest') order.reverse();
    return order;
  }, [pending, query, sort, agentFilter]);

  function exportCsv() {
    const header = ['Receiver ID', 'Name', 'Photos', 'Submitted', 'Agent'];
    const lines = rows.map(row =>
      [
        row.id,
        row.name,
        String(row.photoCount),
        row.submittedAgo,
        row.agentName || '',
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
    link.download = 'pending-verification.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Pending Verification</h1>
            <p className={styles.subtitle}>
              Review and approve receiver profiles.
            </p>
          </div>
          <button type="button" className={styles.exportBtn} onClick={exportCsv}>
            <Download size={15} />
            Export Data
          </button>
        </header>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search} htmlFor="pending-search">
              <Search size={16} />
              <input
                id="pending-search"
                type="search"
                placeholder="Search receiver..."
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </label>
            <label className={styles.filter} htmlFor="agent-filter">
              <span>Agent</span>
              <select
                id="agent-filter"
                value={agentFilter}
                onChange={event => setAgentFilter(event.target.value)}
              >
                <option value="all">All Agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.filter} htmlFor="pending-sort">
              <span>Sort</span>
              <select
                id="pending-sort"
                value={sort}
                onChange={event =>
                  setSort(event.target.value as 'newest' | 'oldest')
                }
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </label>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Photos</th>
                  <th>Submitted</th>
                  <th>Agent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No pending verification right now.
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
                      <span className={styles.meta}>
                        {row.photoCount} photos
                      </span>
                    </td>
                    <td>
                      <span className={styles.meta}>{row.submittedAgo}</span>
                    </td>
                    <td>
                      <span className={styles.meta}>{row.agentName || '—'}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.reviewBtn}
                        onClick={() =>
                          navigate(`/receivers/${row.id}/kyc?from=verification`)
                        }
                      >
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
