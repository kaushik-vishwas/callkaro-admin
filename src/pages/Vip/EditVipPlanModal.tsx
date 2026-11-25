import {useState, type FormEvent} from 'react';
import {ApiError} from '../../api/client';
import {updateVipPlan, type VipPlan} from '../../api/vip';
import styles from './VipPlansPage.module.css';

type Props = {
  plan: VipPlan;
  onClose: () => void;
  onSaved: (name: string) => void;
};

type Form = {
  title: string;
  price: string;
  originalPrice: string;
  days: string;
  bonusCoins: string;
  coinDiscountPercent: string;
  perDayLabel: string;
  saveBadge: string;
  status: 'active' | 'inactive';
};

export function EditVipPlanModal({plan, onClose, onSaved}: Props) {
  const [form, setForm] = useState<Form>({
    title: plan.name,
    price: String(plan.price),
    originalPrice: String(plan.originalPrice),
    days: String(plan.durationDays),
    bonusCoins: String(plan.bonusCoins ?? 0),
    coinDiscountPercent: String(plan.coinDiscountPercent ?? 0),
    perDayLabel: plan.perDayLabel ?? '',
    saveBadge: plan.saveBadge ?? '',
    status: plan.status === 'active' ? 'active' : 'inactive',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm(prev => ({...prev, [key]: value}));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await updateVipPlan(plan.id, {
        title: form.title.trim(),
        priceInr: Number(form.price),
        originalInr: Number(form.originalPrice),
        days: Number(form.days),
        bonusCoins: Number(form.bonusCoins),
        coinDiscountPercent: Number(form.coinDiscountPercent),
        perDayLabel: form.perDayLabel.trim(),
        saveBadge: form.saveBadge.trim(),
        status: form.status,
      });
      onSaved(form.title.trim());
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save VIP plan.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" onSubmit={onSubmit}>
        <h3>Edit {plan.name}</h3>
        <p>Changes show up in the caller app right away. Price applies to new purchases.</p>

        <label className={styles.field}>
          <span>Plan name</span>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            maxLength={60}
            required
          />
        </label>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Price (₹)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={form.price}
              onChange={e => set('price', e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Original price (₹)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={form.originalPrice}
              onChange={e => set('originalPrice', e.target.value)}
              required
            />
          </label>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Duration (days)</span>
            <input
              type="number"
              min={1}
              max={365}
              step={1}
              value={form.days}
              onChange={e => set('days', e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Bonus coins</span>
            <input
              type="number"
              min={0}
              step={1}
              value={form.bonusCoins}
              onChange={e => set('bonusCoins', e.target.value)}
              required
            />
          </label>
        </div>
        <label className={styles.field}>
          <span>Coin rate reduction (%)</span>
          <input
            type="number"
            min={0}
            max={90}
            step={1}
            value={form.coinDiscountPercent}
            onChange={e => set('coinDiscountPercent', e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Per-day label (optional)</span>
          <input
            value={form.perDayLabel}
            onChange={e => set('perDayLabel', e.target.value)}
            placeholder="Leave blank to auto-calculate price per day"
            maxLength={60}
          />
        </label>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Save badge (optional)</span>
            <input
              value={form.saveBadge}
              onChange={e => set('saveBadge', e.target.value)}
              placeholder="e.g. SAVE 30%"
              maxLength={30}
            />
          </label>
          <label className={styles.field}>
            <span>Status</span>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value as Form['status'])}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive (hidden from callers)</option>
            </select>
          </label>
        </div>

        {formError ? <p className={styles.formError}>{formError}</p> : null}

        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.newBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
