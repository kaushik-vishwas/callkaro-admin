import {useEffect, useMemo, useState} from 'react';
import {CalendarDays, Pencil, Plus, Search, Zap} from 'lucide-react';
import {EditVipPlanModal} from './EditVipPlanModal';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchVipPlans,
  formatInr,
  formatNumber,
  type VipPlan,
  type VipPlanStats,
} from '../../api/vip';
import styles from './VipPlansPage.module.css';

const EMPTY_STATS: VipPlanStats = {
  activeVips: 0,
  monthlyRevenue: 0,
  monthlyRevenueLabel: '₹ 0',
  conversionRate: '0%',
};

export function VipPlansPage() {
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<VipPlan | null>(null);
  const [notice, setNotice] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [plans, setPlans] = useState<VipPlan[]>([]);
  const [stats, setStats] = useState<VipPlanStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchVipPlans()
      .then(result => {
        if (cancelled) return;
        setPlans(result.plans || []);
        setStats(result.stats || EMPTY_STATS);
      })
      .catch(err => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : 'Failed to load VIP plans.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter(plan => plan.name.toLowerCase().includes(q));
  }, [query, plans]);

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>VIP Plans Management</h1>
            <p className={styles.subtitle}>
              Configure subscription tiers, manage pricing, and track active VIP
              memberships.
            </p>
          </div>
          <VipSubnav />
        </header>

        <div className={styles.controls}>
          <label className={styles.search}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search plans..."
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={styles.newBtn}
            onClick={() => setShowNew(true)}
          >
            <Plus size={15} />
            New Plan
          </button>
        </div>

        {error ? <p className={styles.subtitle}>{error}</p> : null}
        {notice ? (
          <p className={styles.subtitle} role="status">
            {notice}
          </p>
        ) : null}

        <section className={styles.statGrid}>
          <StatCard
            label="Active VIPs"
            value={formatNumber(stats.activeVips)}
            tone="pink"
          />
          <StatCard
            label="Monthly Revenue"
            value={stats.monthlyRevenueLabel}
            tone="green"
          />
          <StatCard
            label="Conversion Rate"
            value={stats.conversionRate}
            tone="gold"
          />
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2>Active Plans</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      <EmptyTableState label="Loading plans..." />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No plans match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map(plan => (
                    <tr key={plan.id}>
                      <td>
                        <div className={styles.planCell}>
                          <span
                            className={[
                              styles.planIcon,
                              plan.icon === 'bolt'
                                ? styles.iconBolt
                                : styles.iconCal,
                            ].join(' ')}
                          >
                            {plan.icon === 'bolt' ? (
                              <Zap size={14} />
                            ) : (
                              <CalendarDays size={14} />
                            )}
                          </span>
                          <div>
                            <p className={styles.planName}>{plan.name}</p>
                            {plan.popular ? (
                              <span className={styles.popular}>Popular</span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td>{plan.durationLabel}</td>
                      <td className={styles.strong}>{formatInr(plan.price)}</td>
                      <td>
                        <span
                          className={[
                            styles.status,
                            plan.status === 'active'
                              ? styles.statusActive
                              : styles.statusInactive,
                          ].join(' ')}
                        >
                          {plan.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => setEditing(plan)}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className={styles.footer}>
            Showing 1-{filtered.length} of {filtered.length} plans
          </p>
        </section>

        {editing ? (
          <EditVipPlanModal
            plan={editing}
            onClose={() => setEditing(null)}
            onSaved={name => {
              setEditing(null);
              setNotice(`${name} updated.`);
              setReloadKey(key => key + 1);
            }}
          />
        ) : null}

        {showNew ? (
          <div className={styles.modalBackdrop} role="presentation">
            <div className={styles.modal} role="dialog" aria-modal="true">
              <h3>New VIP Plan</h3>
              <p>
                Plans are configured on the server (`VIP_WEEKLY_*` /
                `VIP_MONTHLY_*`). Contact engineering to add a new tier.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setShowNew(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
