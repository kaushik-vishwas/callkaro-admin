import {useMemo, useState} from 'react';
import {CalendarDays, Plus, Search, Zap} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {VipSubnav} from '../../components/vip/VipSubnav/VipSubnav';
import {
  formatInr,
  formatNumber,
  VIP_PLANS,
  VIP_PLAN_STATS,
} from '../../data/vip';
import styles from './VipPlansPage.module.css';

export function VipPlansPage() {
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);

  const plans = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VIP_PLANS;
    return VIP_PLANS.filter(plan => plan.name.toLowerCase().includes(q));
  }, [query]);

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

        <section className={styles.statGrid}>
          <StatCard
            label="Active VIPs"
            value={formatNumber(VIP_PLAN_STATS.activeVips)}
            tone="pink"
          />
          <StatCard
            label="Monthly Revenue"
            value={VIP_PLAN_STATS.monthlyRevenueLabel}
            tone="green"
          />
          <StatCard
            label="Conversion Rate"
            value={VIP_PLAN_STATS.conversionRate}
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
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.empty}>
                      No plans match your search.
                    </td>
                  </tr>
                ) : null}
                {plans.map(plan => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.footer}>
            Showing 1-{plans.length} of {plans.length} plans
          </p>
        </section>

        {showNew ? (
          <div className={styles.modalBackdrop} role="presentation">
            <div className={styles.modal} role="dialog" aria-modal="true">
              <h3>New VIP Plan</h3>
              <p>Plan creation will connect to the API in a later pass.</p>
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
