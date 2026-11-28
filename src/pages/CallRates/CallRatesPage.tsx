import {useEffect, useState} from 'react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ApiError} from '../../api/client';
import {
  fetchCallRates,
  updateCallRate,
  updateCallSplit,
  type CallRate,
  type CallSplit,
} from '../../api/callRates';
import {formatNumber} from '../../api/receivers';
import styles from './CallRatesPage.module.css';

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function CallRatesPage() {
  const [rates, setRates] = useState<CallRate[]>([]);
  const [coinsPerRupee, setCoinsPerRupee] = useState<number>(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [split, setSplit] = useState<CallSplit | null>(null);
  const [splitDraft, setSplitDraft] = useState<CallSplit | null>(null);
  const [savingSplit, setSavingSplit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingLevel, setSavingLevel] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchCallRates();
      setRates(result.rates || []);
      setCoinsPerRupee(result.coinsPerRupee);
      setSplit(result.callSplit);
      setSplitDraft(null);
      setDrafts({});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load call rates.');
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

  async function onSaveSplit() {
    const draft = splitDraft ?? split;
    if (!draft) return;
    const total = Math.round((draft.receiverPercent + draft.agentPercent + draft.adminPercent) * 100) / 100;
    if (total !== 100) {
      setError(`Receiver, agent and admin must add up to 100% (currently ${total}%).`);
      return;
    }
    setSavingSplit(true);
    setError('');
    try {
      await updateCallSplit(draft);
      setNotice('Call and chat earnings split updated.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update split.');
    } finally {
      setSavingSplit(false);
    }
  }

  async function onSave(rate: CallRate) {
    const draft = drafts[rate.level] ?? String(rate.coinsPerMinute);
    const value = Number(draft);
    if (!Number.isInteger(value) || value < 1) {
      setError('Coins per minute must be a whole number, 1 or more.');
      return;
    }
    setSavingLevel(rate.level);
    setError('');
    try {
      await updateCallRate(rate.level, value);
      setNotice(`${rate.label} rate updated to ${formatNumber(value)} coins/min.`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update call rate.');
    } finally {
      setSavingLevel(null);
    }
  }

  const perCoin = coinsPerRupee > 0 ? 1 / coinsPerRupee : 0;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Call Rates</h1>
          <p className={styles.subtitle}>
            Set how many coins a caller is charged per minute by receiver category,
            and how call and chat earnings are split. Changes apply to calls and
            chats started after you save.
          </p>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Call & chat earnings split</h2>
          <div className={styles.coinRow}>
            {(
              [
                ['receiverPercent', 'Receiver %'],
                ['agentPercent', 'Agent %'],
                ['adminPercent', 'Admin %'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className={styles.coinLabel}>
                <span>{label}</span>
                <input
                  className={styles.rateInput}
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  inputMode="decimal"
                  value={(splitDraft ?? split)?.[key] ?? ''}
                  onChange={event =>
                    (splitDraft ?? split) &&
                    setSplitDraft({...(splitDraft ?? split)!, [key]: Number(event.target.value)})
                  }
                  aria-label={label}
                  disabled={loading}
                />
              </label>
            ))}
            <button
              type="button"
              className={styles.saveBtn}
              disabled={!splitDraft || savingSplit || loading}
              onClick={() => void onSaveSplit()}
            >
              {savingSplit ? 'Saving…' : 'Save'}
            </button>
          </div>
          <p className={styles.note}>
            Total: {(() => {
              const s = splitDraft ?? split;
              return s ? Math.round((s.receiverPercent + s.agentPercent + s.adminPercent) * 100) / 100 : 0;
            })()}
            % (must be 100). Splits the receiver's share of call and chat coins. Gift splits are on the Gifts page.
          </p>
        </section>

        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Coins / min (caller)</th>
                  <th>Caller pays / min (₹)</th>
                  <th>Receiver earns / min</th>
                  <th>VIP caller / min (by plan)</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      Loading call rates…
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? rates.map(rate => {
                      const draft = drafts[rate.level] ?? String(rate.coinsPerMinute);
                      const dirty = draft !== String(rate.coinsPerMinute);
                      return (
                        <tr key={rate.level}>
                          <td className={styles.category}>{rate.label}</td>
                          <td>
                            <input
                              className={styles.rateInput}
                              type="number"
                              min={1}
                              step={1}
                              inputMode="numeric"
                              value={draft}
                              onChange={event =>
                                setDrafts({...drafts, [rate.level]: event.target.value})
                              }
                              aria-label={`${rate.label} coins per minute`}
                            />
                          </td>
                          <td>{formatRupees(rate.coinsPerMinute * perCoin)}</td>
                          <td>{formatNumber(rate.receiverSharePerMinute)}</td>
                          <td>
                            Weekly {formatNumber(rate.vipCoinsPerMinute.weekly)} · Monthly{' '}
                            {formatNumber(rate.vipCoinsPerMinute.monthly)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.saveBtn}
                              disabled={!dirty || savingLevel === rate.level}
                              onClick={() => void onSave(rate)}
                            >
                              {savingLevel === rate.level ? 'Saving…' : 'Save'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Receiver earns half of the caller’s coins per minute. VIP callers
            are charged the VIP rate shown above.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
