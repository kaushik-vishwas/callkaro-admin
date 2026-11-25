import {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Eye,
  Search,
  TriangleAlert,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {ReceiverStatusBadge} from '../../components/receivers/ReceiverStatusBadge/ReceiverStatusBadge';
import {
  RankInstructions,
  TopPerformerPodium,
} from '../../components/receivers/TopPerformerRanking/TopPerformerRanking';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {WarnModal} from '../../components/shared/WarnModal/WarnModal';
import {
  fetchReceiverStats,
  fetchReceivers,
  formatInr,
  formatNumber,
  updateReceiverStatus,
  type AdminReceiverListItem,
  type AdminReceiverStats,
} from '../../api/receivers';
import {ApiError} from '../../api/client';
import styles from './ReceiversPage.module.css';

type TabFilter = 'all' | 'online' | 'offline' | 'top' | 'ideal' | 'suspended';

const PAGE_SIZE = 10;

/** Activate works for every stage except Draft (profile not yet submitted)
 *  and Verified (already active). */
function canActivate(receiver: AdminReceiverListItem) {
  if (receiver.stage) {
    return ['suspended', 'blocked', 'rejected', 'pending'].includes(
      receiver.stage,
    );
  }
  return receiver.status !== 'active';
}

const tabs: Array<{id: TabFilter; label: string}> = [
  {id: 'all', label: 'All'},
  {id: 'online', label: 'Online'},
  {id: 'offline', label: 'Offline'},
  {id: 'ideal', label: 'Predicted Ideal'},
  {id: 'suspended', label: 'Suspended'},
];

export function ReceiversPage({view = 'all'}: {view?: 'all' | 'top'}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');
  // The Top Performers view is its own route; it overrides the in-page filter.
  const tab: TabFilter = view === 'top' ? 'top' : tabFilter;
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');
  const [rows, setRows] = useState<AdminReceiverListItem[]>([]);
  const [stats, setStats] = useState<AdminReceiverStats | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [warnTarget, setWarnTarget] = useState<AdminReceiverListItem | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [topThree, setTopThree] = useState<AdminReceiverListItem[]>([]);

  // Podium (top 3) is only shown on the Top Performers view.
  useEffect(() => {
    if (view !== 'top') return;
    let cancelled = false;
    fetchReceivers({tab: 'top', page: 1, limit: 3})
      .then(result => {
        if (!cancelled) setTopThree(result.receivers);
      })
      .catch(() => {
        if (!cancelled) setTopThree([]);
      });
    return () => {
      cancelled = true;
    };
  }, [view]);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        fetchReceivers({
          q: debouncedQuery || undefined,
          tab,
          page,
          limit: PAGE_SIZE,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        fetchReceiverStats(),
      ]);
      setRows(listResult.receivers);
      setTotal(listResult.pagination.total);
      setTotalPages(listResult.pagination.totalPages);
      setStats(statsResult.stats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load receivers.',
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

  async function onSuspend(receiver: AdminReceiverListItem) {
    if (
      !window.confirm(
        `Suspend ${receiver.name}? Access will be paused until activated again.`,
      )
    ) {
      return;
    }
    setBusyId(receiver.id);
    try {
      await updateReceiverStatus(receiver.id, 'suspend');
      setNotice(`${receiver.name} has been suspended.`);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to block receiver.',
      );
    } finally {
      setBusyId(null);
    }
  }

  async function onActivate(receiver: AdminReceiverListItem) {
    if (!window.confirm(`Activate ${receiver.name}? They will be able to go online again.`)) {
      return;
    }
    setBusyId(receiver.id);
    try {
      await updateReceiverStatus(receiver.id, 'activate');
      setNotice(`${receiver.name} has been activated.`);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to activate receiver.',
      );
    } finally {
      setBusyId(null);
    }
  }

  const statCards = [
    {
      id: 'total',
      label: 'Total Receivers',
      value: formatNumber(stats?.totalReceivers || 0),
      tone: 'pink',
    },
    {
      id: 'online',
      label: 'Online',
      value: formatNumber(stats?.onlineNow || 0),
      tone: 'green',
    },
    {
      id: 'offline',
      label: 'Offline',
      value: formatNumber(stats?.offline || 0),
      tone: 'dark',
    },
    {
      id: 'suspended',
      label: 'Suspended',
      value: formatNumber(stats?.suspended || 0),
      tone: 'red',
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: stats?.totalRevenueLabel || '₹ 0',
      tone: 'purple',
    },
    {
      id: 'paid',
      label: 'Earnings Paid',
      value: stats?.earningsPaidLabel || '₹ 0',
      tone: 'pink',
    },
    {
      id: 'pending',
      label: 'Pending W/D',
      value: stats?.pendingWdLabel || '₹ 0',
      tone: 'amber',
    },
  ] as const;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Receiver Profiles</h1>
            <p className={styles.subtitle}>
              Manage all receivers on the platform.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div>
              <span className={styles.headerStatLabel}>Total Receivers</span>
              <strong className={styles.statDark}>
                {formatNumber(stats?.totalReceivers || 0)}
              </strong>
            </div>
            <div>
              <span className={styles.headerStatLabel}>Online Now</span>
              <strong className={styles.statPurple}>
                {formatNumber(stats?.onlineNow || 0)}
              </strong>
            </div>
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

        {view === 'top' ? (
          <div className={styles.rankGrid}>
            <TopPerformerPodium top={topThree} />
            <RankInstructions currentRank={topThree[0]?.rank ?? null} />
          </div>
        ) : null}

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
                placeholder="Search Receiver Profiles"
                aria-label="Search receivers"
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
                    setTabFilter(item.id);
                    setPage(1);
                    if (view === 'top') navigate('/receivers');
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
          {notice ? (
            <p className={styles.noticeBanner} role="status">
              {notice}
            </p>
          ) : null}
          {loading ? (
            <p className={styles.loading}>Loading receivers…</p>
          ) : null}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Receiver ID</th>
                  <th>Assigned Agent</th>
                  <th>Calls</th>
                  <th>Coins Earned</th>
                  {tab === 'ideal' ? <th>Online today</th> : null}
                  {tab === 'ideal' ? <th>Level</th> : null}
                  {tab !== 'ideal' ? <th>Revenue</th> : null}
                  <th>Earnings</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tab === 'ideal' ? 11 : 10}
                      className={styles.emptyCell}
                    >
                      <EmptyTableState
                        label={
                          tab === 'ideal'
                            ? 'No predicted ideal receivers right now.'
                            : 'No receivers found.'
                        }
                      />
                    </td>
                  </tr>
                ) : null}
                {rows.map(receiver => (
                  <tr key={receiver.id}>
                    <td>
                      <Link
                        to={`/receivers/${receiver.id}`}
                        className={styles.personCell}
                      >
                        <CallerAvatar name={receiver.name} />
                        <span>{receiver.name}</span>
                      </Link>
                    </td>
                    <td>{receiver.code}</td>
                    <td>
                      <span className={styles.agentLink}>
                        {receiver.agentName}
                      </span>
                    </td>
                    <td>{formatNumber(receiver.calls)}</td>
                    <td>{formatNumber(receiver.coinsEarned)}</td>
                    {tab === 'ideal' ? (
                      <td>
                        {(
                          (receiver.engagementMinutesToday || 0) / 60
                        ).toFixed(1)}
                        h
                      </td>
                    ) : null}
                    {tab === 'ideal' ? (
                      <td>L{receiver.level || 1}</td>
                    ) : null}
                    {tab !== 'ideal' ? (
                      <td>{formatInr(receiver.revenue)}</td>
                    ) : null}
                    <td className={styles.earnings}>
                      {formatInr(receiver.earnings)}
                    </td>
                    <td className={styles.rank}>#{receiver.rank}</td>
                    <td>
                      <ReceiverStatusBadge status={receiver.status} stage={receiver.stage} />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/receivers/${receiver.id}`}
                          className={styles.iconBtn}
                          title="View"
                          aria-label={`View ${receiver.name}`}
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          className={styles.iconBtnWarn}
                          title="Warn"
                          aria-label={`Warn ${receiver.name}`}
                          onClick={() => {
                            setError('');
                            setWarnTarget(receiver);
                          }}
                          disabled={busyId === receiver.id}
                        >
                          <TriangleAlert size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtnSuccess}
                          title={
                            canActivate(receiver)
                              ? 'Activate'
                              : 'Draft profiles can’t be activated yet'
                          }
                          aria-label={`Activate ${receiver.name}`}
                          onClick={() => void onActivate(receiver)}
                          disabled={!canActivate(receiver) || busyId === receiver.id}
                        >
                          <CircleCheck size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtnDanger}
                          title={
                            receiver.stage === 'suspended' || receiver.stage === 'blocked'
                              ? 'Already suspended'
                              : 'Suspend'
                          }
                          aria-label={`Suspend ${receiver.name}`}
                          onClick={() => void onSuspend(receiver)}
                          disabled={
                            receiver.stage === 'suspended' ||
                            receiver.stage === 'blocked' ||
                            busyId === receiver.id
                          }
                        >
                          <PauseCircle size={15} />
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
      <WarnModal
        target={warnTarget}
        appLabel="receiver's app"
        send={(id, message) => updateReceiverStatus(id, 'warn', message)}
        onClose={() => setWarnTarget(null)}
        onSent={name => {
          setWarnTarget(null);
          setNotice(`Warning sent to ${name}.`);
        }}
      />
    </DashboardShell>
  );
}
