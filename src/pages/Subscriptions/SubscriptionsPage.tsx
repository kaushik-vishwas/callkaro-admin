import {useEffect, useState, type FormEvent} from 'react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ApiError} from '../../api/client';
import {
  fetchVipPlans,
  updateVipPlan,
  VIP_BENEFIT_LABELS,
  type VipBenefitKey,
  type VipBenefits,
  type VipPlan,
  type VipPlanStatus,
} from '../../api/vip';

const BENEFIT_ORDER: VipBenefitKey[] = [
  'videoDiscount',
  'rechargeBonus',
  'freeChat',
  'crownProfile',
  'prioritySupport',
];
import {formatInr, formatNumber} from '../../api/receivers';
import styles from './SubscriptionsPage.module.css';

const DISCOUNT_HINT =
  'The coin rate reduction applies to the caller’s per-minute rate while the plan is active.';

export function SubscriptionsPage() {
  const [plans, setPlans] = useState<VipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<VipPlan | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchVipPlans()
      .then(result => {
        if (!cancelled) setPlans(result.plans || []);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load subscriptions.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(id);
  }, [notice]);

  const ordered = ['weekly', 'monthly']
    .map(id => plans.find(plan => plan.id === id))
    .filter((plan): plan is VipPlan => Boolean(plan));

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Subscriptions</h1>
          <p className={styles.subtitle}>
            Weekly and monthly VIP plans: price, and the coin rate reduction
            callers get while subscribed. Changes show in the caller app right away.
          </p>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        {loading ? <p className={styles.muted}>Loading plans…</p> : null}

        <section className={styles.planGrid}>
          {ordered.map(plan => (
            <article key={plan.id} className={styles.planCard}>
              <div className={styles.planTop}>
                <div>
                  <p className={styles.planName}>{plan.name}</p>
                  <p className={styles.planDuration}>{plan.durationLabel}</p>
                </div>
                <span
                  className={
                    plan.status === 'active' ? styles.statusActive : styles.statusInactive
                  }
                >
                  {plan.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className={styles.metrics}>
                <div>
                  <p className={styles.metricLabel}>Price</p>
                  <p className={styles.metricValue}>{formatInr(plan.price)}</p>
                </div>
                <div>
                  <p className={styles.metricLabel}>Coin rate reduction</p>
                  <p className={styles.metricValueAccent}>
                    {formatNumber(plan.coinDiscountPercent ?? 0)}%
                  </p>
                </div>
                <div>
                  <p className={styles.metricLabel}>Recharge bonus</p>
                  <p className={styles.metricValueAccent}>
                    {formatNumber(plan.rechargeBonusPercent ?? 0)}%
                  </p>
                </div>
              </div>

              <div className={styles.benefitsBox}>
                <p className={styles.benefitsTitle}>Subscriber benefits</p>
                <ul className={styles.benefits}>
                  {BENEFIT_ORDER.map(key => {
                    const granted = plan.benefits?.[key] !== false;
                    const detail =
                      key === 'videoDiscount'
                        ? ` (${formatNumber(plan.coinDiscountPercent ?? 0)}%)`
                        : key === 'rechargeBonus'
                          ? ` (${formatNumber(plan.rechargeBonusPercent ?? 0)}%)`
                          : '';
                    return (
                      <li
                        key={key}
                        className={granted ? styles.benefitOn : styles.benefitOff}
                      >
                        {granted ? '✓' : '✗'} {VIP_BENEFIT_LABELS[key]}
                        {granted ? detail : ' — not included'}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                type="button"
                className={styles.editBtn}
                onClick={() => setEditing(plan)}
              >
                Edit plan
              </button>
            </article>
          ))}
        </section>

        <p className={styles.hint}>{DISCOUNT_HINT}</p>

        {editing ? (
          <EditSubscriptionModal
            plan={editing}
            onClose={() => setEditing(null)}
            onSaved={name => {
              setEditing(null);
              setNotice(`${name} updated.`);
              setReloadKey(key => key + 1);
            }}
          />
        ) : null}
      </div>
    </DashboardShell>
  );
}

type ModalProps = {
  plan: VipPlan;
  onClose: () => void;
  onSaved: (name: string) => void;
};

function EditSubscriptionModal({plan, onClose, onSaved}: ModalProps) {
  const [price, setPrice] = useState(String(plan.price));
  const [discount, setDiscount] = useState(String(plan.coinDiscountPercent ?? 0));
  const [bonus, setBonus] = useState(String(plan.rechargeBonusPercent ?? 0));
  const [status, setStatus] = useState<VipPlanStatus>(plan.status);
  const [benefits, setBenefits] = useState<VipBenefits>({
    videoDiscount: plan.benefits?.videoDiscount !== false,
    rechargeBonus: plan.benefits?.rechargeBonus !== false,
    freeChat: plan.benefits?.freeChat !== false,
    crownProfile: plan.benefits?.crownProfile !== false,
    prioritySupport: plan.benefits?.prioritySupport !== false,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const priceInr = Number(price);
    const coinDiscountPercent = Number(discount);
    if (!Number.isInteger(priceInr) || priceInr < 1) {
      setFormError('Price must be a whole rupee amount, 1 or more.');
      return;
    }
    if (!Number.isInteger(coinDiscountPercent) || coinDiscountPercent < 0 || coinDiscountPercent > 90) {
      setFormError('Coin rate reduction must be a whole number from 0 to 90.');
      return;
    }
    const rechargeBonusPercent = Number(bonus);
    if (!Number.isInteger(rechargeBonusPercent) || rechargeBonusPercent < 0 || rechargeBonusPercent > 50) {
      setFormError('Recharge bonus must be a whole number from 0 to 50.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await updateVipPlan(plan.id, {
        priceInr,
        coinDiscountPercent,
        rechargeBonusPercent,
        benefits,
        status,
      });
      onSaved(plan.name);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" onSubmit={onSubmit}>
        <h3>Edit {plan.name}</h3>

        <label className={styles.field}>
          <span>Price (₹)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={price}
            onChange={event => setPrice(event.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Coin rate reduction (%)</span>
          <input
            type="number"
            min={0}
            max={90}
            step={1}
            value={discount}
            onChange={event => setDiscount(event.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Recharge bonus (%)</span>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            value={bonus}
            onChange={event => setBonus(event.target.value)}
            required
          />
        </label>

        <fieldset className={styles.benefitFieldset}>
          <legend className={styles.field}>Subscriber benefits (tick = callers get it)</legend>
          {BENEFIT_ORDER.map(key => (
            <label key={key} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={benefits[key]}
                onChange={event =>
                  setBenefits(prev => ({...prev, [key]: event.target.checked}))
                }
              />
              <span>{VIP_BENEFIT_LABELS[key]}</span>
            </label>
          ))}
        </fieldset>

        <label className={styles.field}>
          <span>Status</span>
          <select value={status} onChange={event => setStatus(event.target.value as VipPlanStatus)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive (hidden from callers)</option>
          </select>
        </label>

        {formError ? <p className={styles.errorBanner}>{formError}</p> : null}

        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
