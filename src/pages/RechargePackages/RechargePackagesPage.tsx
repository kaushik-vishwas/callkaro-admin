import {useEffect, useState, type FormEvent} from 'react';
import {Pencil, Plus, Trash2, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  createRechargePack,
  deleteRechargePack,
  fetchRechargePacks,
  updateRechargePack,
  type RechargePack,
  type RechargePackInput,
  type RechargePackStatus,
} from '../../api/rechargePacks';
import {formatInr, formatNumber} from '../../api/receivers';
import styles from './RechargePackagesPage.module.css';

type FormState = {
  id?: string;
  amount: string;
  coins: string;
  status: RechargePackStatus;
};

const EMPTY_FORM: FormState = {amount: '', coins: '', status: 'active'};

function validate(form: FormState): string {
  const amount = Number(form.amount);
  const coins = Number(form.coins);
  if (!Number.isInteger(amount) || amount <= 0) {
    return 'Amount must be a whole rupee value greater than 0.';
  }
  if (!Number.isInteger(coins) || coins <= 0) {
    return 'Coins must be a whole number greater than 0.';
  }
  return '';
}

export function RechargePackagesPage() {
  const [packs, setPacks] = useState<RechargePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchRechargePacks();
      setPacks(result.packs || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load recharge packs.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(id);
  }, [notice]);

  function openCreate() {
    setFormError('');
    setForm({...EMPTY_FORM});
  }

  function openEdit(pack: RechargePack) {
    setFormError('');
    setForm({
      id: pack.id,
      amount: String(pack.amountInr),
      coins: String(pack.coins),
      status: pack.status,
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    const problem = validate(form);
    if (problem) {
      setFormError(problem);
      return;
    }
    const payload: RechargePackInput = {
      amountInr: Number(form.amount),
      coins: Number(form.coins),
      status: form.status,
    };
    setSaving(true);
    setFormError('');
    try {
      if (form.id) {
        await updateRechargePack(form.id, payload);
        setNotice('Recharge package updated.');
      } else {
        await createRechargePack(payload);
        setNotice('Recharge package added.');
      }
      setForm(null);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Failed to save recharge package.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(pack: RechargePack) {
    setBusyId(pack.id);
    setError('');
    try {
      await updateRechargePack(pack.id, {
        status: pack.status === 'active' ? 'inactive' : 'active',
      });
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update status.',
      );
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(pack: RechargePack) {
    if (
      !window.confirm(
        `Delete the ${formatInr(pack.amountInr)} package (${formatNumber(pack.coins)} coins)?`,
      )
    ) {
      return;
    }
    setBusyId(pack.id);
    setError('');
    try {
      await deleteRechargePack(pack.id);
      setNotice('Recharge package deleted.');
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to delete package.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Recharge Packages</h1>
            <p className={styles.subtitle}>
              Set the rupee amount and the coins each recharge pack gives to
              callers.
            </p>
          </div>
          <button type="button" className={styles.primaryBtn} onClick={openCreate}>
            <Plus size={16} /> Add Package
          </button>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Coins</th>
                  <th>Coins per ₹1</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      Loading packages…
                    </td>
                  </tr>
                ) : null}
                {!loading && packs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      <EmptyTableState label="No recharge packages yet. Click Add Package." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? packs.map(pack => (
                      <tr key={pack.id}>
                        <td className={styles.amount}>{formatInr(pack.amountInr)}</td>
                        <td className={styles.coins}>{formatNumber(pack.coins)}</td>
                        <td>{(pack.coins / pack.amountInr).toFixed(1)}</td>
                        <td>
                          <button
                            type="button"
                            className={
                              pack.status === 'active'
                                ? styles.statusActive
                                : styles.statusInactive
                            }
                            onClick={() => void onToggleStatus(pack)}
                            disabled={busyId === pack.id}
                            title="Click to toggle"
                          >
                            {pack.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title="Edit"
                              aria-label={`Edit ${formatInr(pack.amountInr)} package`}
                              onClick={() => openEdit(pack)}
                              disabled={busyId === pack.id}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtnDanger}
                              title="Delete"
                              aria-label={`Delete ${formatInr(pack.amountInr)} package`}
                              onClick={() => void onDelete(pack)}
                              disabled={busyId === pack.id}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {form ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <form className={styles.modal} onSubmit={onSubmit}>
            <div className={styles.modalHeader}>
              <h2>{form.id ? 'Edit Package' : 'Add Package'}</h2>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setForm(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <label className={styles.field}>
              <span>Amount (₹)</span>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="e.g. 200"
                value={form.amount}
                onChange={event => setForm({...form, amount: event.target.value})}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Coins</span>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="e.g. 5000"
                value={form.coins}
                onChange={event => setForm({...form, coins: event.target.value})}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Status</span>
              <select
                value={form.status}
                onChange={event =>
                  setForm({...form, status: event.target.value as RechargePackStatus})
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            {formError ? <p className={styles.errorBanner}>{formError}</p> : null}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setForm(null)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={saving}>
                {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add package'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardShell>
  );
}
