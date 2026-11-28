import {useEffect, useState} from 'react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {ApiError} from '../../api/client';
import {updateCoinValue} from '../../api/callRates';
import {
  fetchMoneySettings,
  updatePlatformSettings,
  type PlatformSettings,
} from '../../api/moneySettings';
import {formatNumber} from '../../api/receivers';
import styles from '../CallRates/CallRatesPage.module.css';

type NumberKey = Exclude<keyof PlatformSettings, 'supportEmail' | 'supportPhone' | 'supportHours'>;

export function MoneySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [coinsPerRupee, setCoinsPerRupee] = useState<number>(0);

  const [drafts, setDrafts] = useState<Partial<Record<NumberKey, string>>>({});
  const [coinDraft, setCoinDraft] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchMoneySettings();
      setSettings(result.settings);
      setCoinsPerRupee(result.coinsPerRupee);
      setDrafts({});
      setCoinDraft(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load settings.');
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

  async function run(section: string, action: () => Promise<unknown>, done: string) {
    setSaving(section);
    setError('');
    try {
      await action();
      setNotice(done);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save.');
    } finally {
      setSaving(null);
    }
  }

  function saveGroup(section: string, keys: NumberKey[], done: string) {
    const payload: Partial<Record<NumberKey, number>> = {};
    for (const key of keys) {
      const raw = drafts[key];
      if (raw === undefined) continue;
      const value = key === 'withdrawFeeRate' ? Number(raw) / 100 : Number(raw);
      if (!Number.isFinite(value)) {
        setError('Enter a valid number.');
        return;
      }
      payload[key] = value;
    }
    if (Object.keys(payload).length === 0) return;
    void run(section, () => updatePlatformSettings(payload), done);
  }

  function displayValue(key: NumberKey): string {
    if (drafts[key] !== undefined) return drafts[key] as string;
    if (!settings) return '';
    const value = settings[key];
    if (key === 'withdrawFeeRate') return String(Math.round(Number(value) * 10000) / 100);
    return String(value);
  }

  function isDirty(keys: NumberKey[]): boolean {
    return keys.some(key => drafts[key] !== undefined);
  }

  const perCoinRupee = coinsPerRupee > 0 ? 1 / coinsPerRupee : 0;
  const coinShown = coinDraft ?? String(coinsPerRupee || '');

  const numberField = (key: NumberKey, label: string, step = 1) => (
    <label className={styles.coinLabel} key={key}>
      <span>{label}</span>
      <input
        className={styles.rateInput}
        type="number"
        min={0}
        step={step}
        inputMode="decimal"
        value={displayValue(key)}
        onChange={event => setDrafts({...drafts, [key]: event.target.value})}
        aria-label={label}
        disabled={loading}
      />
    </label>
  );

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Monetary Config</h1>
          <p className={styles.subtitle}>
            Coin value, chat cost, talk rewards, free talk and withdrawal rules.
            Changes apply right away.
          </p>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Coin value</h2>
          <div className={styles.coinRow}>
            <label className={styles.coinLabel}>
              <span>Coins per ₹1</span>
              <input
                className={styles.rateInput}
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={coinShown}
                onChange={event => setCoinDraft(event.target.value)}
                aria-label="Coins per rupee"
                disabled={loading}
              />
            </label>
            <button
              type="button"
              className={styles.saveBtn}
              disabled={coinDraft === null || coinDraft === String(coinsPerRupee) || saving !== null || loading}
              onClick={() =>
                void run(
                  'coin',
                  () => updateCoinValue(Number(coinDraft ?? coinsPerRupee)),
                  `Coin value updated: ₹1 = ${formatNumber(Number(coinDraft))} coins.`,
                )
              }
            >
              {saving === 'coin' ? 'Saving…' : 'Save'}
            </button>
          </div>
          <p className={styles.note}>
            Currently 1 coin = ₹{perCoinRupee.toLocaleString('en-IN', {maximumFractionDigits: 4})}.
            Used for receiver earnings, withdrawals, gifts and coin amounts in the apps.
          </p>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Chat & talk rewards</h2>
          <div className={styles.coinRow}>
            {numberField('coinsPerChatMessage', 'Coins per chat message (callers)')}
            {numberField('milestone30Coins', 'Reward at 30 min talk')}
            {numberField('milestone60Coins', 'Reward at 60 min talk')}
            {numberField('milestone120Coins', 'Reward at 120 min talk')}
            <button
              type="button"
              className={styles.saveBtn}
              disabled={!isDirty(['coinsPerChatMessage', 'milestone30Coins', 'milestone60Coins', 'milestone120Coins']) || saving !== null}
              onClick={() =>
                saveGroup(
                  'chat',
                  ['coinsPerChatMessage', 'milestone30Coins', 'milestone60Coins', 'milestone120Coins'],
                  'Chat and talk rewards updated.',
                )
              }
            >
              {saving === 'chat' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Free talk</h2>
          <div className={styles.coinRow}>
            {numberField('welcomeFreeMinutes', 'Free talk minutes (new callers)')}
            <button
              type="button"
              className={styles.saveBtn}
              disabled={!isDirty(['welcomeFreeMinutes']) || saving !== null}
              onClick={() => saveGroup('freetalk', ['welcomeFreeMinutes'], 'Free talk updated.')}
            >
              {saving === 'freetalk' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Withdrawals</h2>
          <div className={styles.coinRow}>
            {numberField('withdrawFeeRate', 'Fee (%)', 0.01)}
            {numberField('withdrawMinBalanceInr', 'Minimum balance (₹)')}
            {numberField('withdrawMinAmountInr', 'Minimum withdrawal (₹)')}
            <button
              type="button"
              className={styles.saveBtn}
              disabled={!isDirty(['withdrawFeeRate', 'withdrawMinBalanceInr', 'withdrawMinAmountInr']) || saving !== null}
              onClick={() =>
                saveGroup(
                  'withdraw',
                  ['withdrawFeeRate', 'withdrawMinBalanceInr', 'withdrawMinAmountInr'],
                  'Withdrawal rules updated.',
                )
              }
            >
              {saving === 'withdraw' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
