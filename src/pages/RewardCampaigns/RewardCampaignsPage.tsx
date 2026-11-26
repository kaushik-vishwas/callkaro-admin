import {useEffect, useState, type FormEvent} from 'react';
import {Pencil, Plus, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {formatNumber, formatInr} from '../../api/receivers';
import {
  createRewardCampaign,
  fetchCallerCampaignHistory,
  fetchCampaignReport,
  fetchRewardCampaigns,
  updateRewardCampaign,
  type CallerHistory,
  type CampaignInput,
  type CampaignReportRow,
  type CampaignStatus,
  type ExtensionPolicy,
  type MissedDayPolicy,
  type RewardCampaign,
} from '../../api/rewardCampaigns';
import styles from './RewardCampaignsPage.module.css';

const MAX_DAYS = 31;

type EditorState = {
  id?: string;
  name: string;
  minRecharge: string;
  days: string[];
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
  missedDayPolicy: MissedDayPolicy;
  extensionPolicy: ExtensionPolicy;
  enrolledCallers: number;
};

/** The example campaign from the spec, used as the starting point for new campaigns. */
const DEFAULT_DAYS = ['500', '500', '500', '500', '1000', '1000', '1000'];

const EMPTY: EditorState = {
  name: '',
  minRecharge: '500',
  days: DEFAULT_DAYS,
  status: 'active',
  startsAt: '',
  endsAt: '',
  missedDayPolicy: 'forfeit',
  extensionPolicy: 'extend',
  enrolledCallers: 0,
};

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function policyLabel(value: string): string {
  return (
    {
      forfeit: 'Missed day is lost',
      pause: 'Pause until next claim',
      extend: 'Extend by one cycle',
      restart: 'Restart from Day 1',
      none: 'No change',
    } as Record<string, string>
  )[value] ?? value;
}

export function RewardCampaignsPage() {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [summary, setSummary] = useState({promoCoinsDistributed: 0, claimsMade: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [editorError, setEditorError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [reportFor, setReportFor] = useState<RewardCampaign | null>(null);
  const [reportRows, setReportRows] = useState<CampaignReportRow[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [history, setHistory] = useState<CallerHistory | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetchRewardCampaigns();
      setCampaigns(res.campaigns || []);
      setSummary(res.summary);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load campaigns.');
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
    setEditorError('');
    setEditor({...EMPTY, days: [...DEFAULT_DAYS]});
  }

  function openEdit(c: RewardCampaign) {
    setEditorError('');
    setEditor({
      id: c.id,
      name: c.name,
      minRecharge: String(c.minRechargeInr),
      days: c.dailyCoins.map(String),
      status: c.status,
      startsAt: toLocalInput(c.startsAt),
      endsAt: toLocalInput(c.endsAt),
      missedDayPolicy: c.missedDayPolicy,
      extensionPolicy: c.extensionPolicy,
      enrolledCallers: c.enrolledCallers,
    });
  }

  function setDays(next: string[]) {
    setEditor(current => (current ? {...current, days: next} : current));
  }

  function validate(e: EditorState): string {
    if (!e.name.trim()) return 'Campaign name is required.';
    const min = Number(e.minRecharge);
    if (!Number.isInteger(min) || min < 1) return 'Minimum recharge must be at least ₹1.';
    if (!e.days.length) return 'Add at least one day.';
    if (e.days.some(d => d.trim() === '' || !Number.isInteger(Number(d)) || Number(d) < 0)) {
      return 'Every day needs a whole coin amount, 0 or more.';
    }
    if (e.startsAt && e.endsAt && new Date(e.endsAt) < new Date(e.startsAt)) {
      return 'End date must be after the start date.';
    }
    return '';
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!editor) return;
    const problem = validate(editor);
    if (problem) {
      setEditorError(problem);
      return;
    }
    const payload: CampaignInput = {
      name: editor.name.trim(),
      minRechargeInr: Number(editor.minRecharge),
      dailyCoins: editor.days.map(Number),
      status: editor.status,
      startsAt: editor.startsAt ? new Date(editor.startsAt).toISOString() : null,
      endsAt: editor.endsAt ? new Date(editor.endsAt).toISOString() : null,
      missedDayPolicy: editor.missedDayPolicy,
      extensionPolicy: editor.extensionPolicy,
    };
    setSaving(true);
    setEditorError('');
    try {
      if (editor.id) {
        await updateRewardCampaign(editor.id, payload);
        setNotice('Campaign updated.');
      } else {
        await createRewardCampaign(payload);
        setNotice('Campaign created.');
      }
      setEditor(null);
      await load();
    } catch (err) {
      setEditorError(err instanceof ApiError ? err.message : 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(c: RewardCampaign) {
    setBusyId(c.id);
    setError('');
    try {
      await updateRewardCampaign(c.id, {status: c.status === 'active' ? 'inactive' : 'active'});
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status.');
    } finally {
      setBusyId(null);
    }
  }

  async function openReport(c: RewardCampaign) {
    setReportFor(c);
    setReportRows([]);
    setReportLoading(true);
    try {
      const res = await fetchCampaignReport(c.id);
      setReportRows(res.items || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load report.');
    } finally {
      setReportLoading(false);
    }
  }

  async function openHistory(row: CampaignReportRow) {
    if (!reportFor) return;
    try {
      const res = await fetchCallerCampaignHistory(reportFor.id, row.callerId);
      setHistory(res.history);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load history.');
    }
  }

  const scheduleLocked = Boolean(editor?.id && editor.enrolledCallers > 0);
  const totalCoins = editor ? editor.days.reduce((s, d) => s + (Number(d) || 0), 0) : 0;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Recharge Campaigns</h1>
            <p className={styles.subtitle}>
              Reward callers with free promotional coins for recharging and checking in daily.
            </p>
          </div>
          <button type="button" className={styles.primaryBtn} onClick={openCreate}>
            <Plus size={16} /> New campaign
          </button>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        <div className={styles.summaryGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Promotional coins distributed</div>
            <div className={styles.statValue}>{formatNumber(summary.promoCoinsDistributed)}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Daily claims made</div>
            <div className={styles.statValue}>{formatNumber(summary.claimsMade)}</div>
          </div>
        </div>

        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Min recharge</th>
                  <th>Days</th>
                  <th>Total coins</th>
                  <th>Rules</th>
                  <th>Callers</th>
                  <th>Distributed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyCell}>
                      Loading campaigns…
                    </td>
                  </tr>
                ) : null}
                {!loading && campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyCell}>
                      <EmptyTableState label="No campaigns yet. Click New campaign." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? campaigns.map(c => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <div className={styles.muted}>
                            {c.startsAt || c.endsAt
                              ? `${c.startsAt ? new Date(c.startsAt).toLocaleDateString('en-IN') : 'Now'} → ${c.endsAt ? new Date(c.endsAt).toLocaleDateString('en-IN') : 'Open'}`
                              : 'Open-ended'}
                          </div>
                        </td>
                        <td>{formatInr(c.minRechargeInr)}</td>
                        <td>{c.durationDays}</td>
                        <td className={styles.coins}>{formatNumber(c.totalCoins)}</td>
                        <td>
                          <div className={styles.muted}>Missed: {policyLabel(c.missedDayPolicy)}</div>
                          <div className={styles.muted}>Recharge again: {policyLabel(c.extensionPolicy)}</div>
                        </td>
                        <td>
                          {formatNumber(c.enrolledCallers)} enrolled
                          <div className={styles.muted}>{formatNumber(c.completedCallers)} completed</div>
                        </td>
                        <td className={styles.coins}>{formatNumber(c.coinsDistributed)}</td>
                        <td>
                          <button
                            type="button"
                            className={c.status === 'active' ? styles.statusActive : styles.statusInactive}
                            onClick={() => void onToggleStatus(c)}
                            disabled={busyId === c.id}
                          >
                            {c.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button type="button" className={styles.secondaryBtn} onClick={() => void openReport(c)}>
                              Report
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title="Edit"
                              aria-label={`Edit ${c.name}`}
                              onClick={() => openEdit(c)}
                            >
                              <Pencil size={15} />
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

      {editor ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <form className={styles.modal} onSubmit={onSubmit} style={{maxWidth: 720}}>
            <div className={styles.modalHeader}>
              <h2>{editor.id ? 'Edit campaign' : 'New campaign'}</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setEditor(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Campaign name</span>
                <input
                  type="text"
                  maxLength={80}
                  value={editor.name}
                  onChange={e => setEditor({...editor, name: e.target.value})}
                  placeholder="Weekly Recharge Bonus"
                  required
                />
              </label>
              <label className={styles.field}>
                <span>Minimum recharge (₹)</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={editor.minRecharge}
                  onChange={e => setEditor({...editor, minRecharge: e.target.value})}
                  required
                />
              </label>
            </div>

            <div className={styles.field}>
              <span>
                Daily reward coins · {editor.days.length} day{editor.days.length === 1 ? '' : 's'} ·{' '}
                <span className={styles.totalPill}>Total {formatNumber(totalCoins)} coins</span>
              </span>
              {scheduleLocked ? (
                <p className={styles.notice}>
                  Callers are already enrolled, so the schedule is locked. Create a new campaign to change the days.
                </p>
              ) : null}
              <div className={styles.dayGrid}>
                {editor.days.map((value, index) => (
                  <div className={styles.dayCard} key={index}>
                    <span className={styles.dayLabel}>Day {index + 1}</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={value}
                      disabled={scheduleLocked}
                      aria-label={`Day ${index + 1} coins`}
                      onChange={e => {
                        const next = [...editor.days];
                        next[index] = e.target.value;
                        setDays(next);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.dayActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  disabled={scheduleLocked || editor.days.length >= MAX_DAYS}
                  onClick={() => setDays([...editor.days, editor.days[editor.days.length - 1] || '0'])}
                >
                  + Add day
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  disabled={scheduleLocked || editor.days.length <= 1}
                  onClick={() => setDays(editor.days.slice(0, -1))}
                >
                  − Remove last day
                </button>
              </div>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Valid from (optional)</span>
                <input
                  type="datetime-local"
                  value={editor.startsAt}
                  onChange={e => setEditor({...editor, startsAt: e.target.value})}
                />
              </label>
              <label className={styles.field}>
                <span>Valid until (optional)</span>
                <input
                  type="datetime-local"
                  value={editor.endsAt}
                  onChange={e => setEditor({...editor, endsAt: e.target.value})}
                />
              </label>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Missed days</span>
                <select
                  value={editor.missedDayPolicy}
                  disabled={scheduleLocked}
                  onChange={e => setEditor({...editor, missedDayPolicy: e.target.value as MissedDayPolicy})}
                >
                  <option value="forfeit">Lost — a day must be claimed on its own day</option>
                  <option value="pause">Pause — claim the next day whenever you return</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Recharge again during campaign</span>
                <select
                  value={editor.extensionPolicy}
                  disabled={scheduleLocked}
                  onChange={e => setEditor({...editor, extensionPolicy: e.target.value as ExtensionPolicy})}
                >
                  <option value="extend">Extend — add another full cycle</option>
                  <option value="restart">Restart — begin again from Day 1</option>
                  <option value="none">No change — ignore the new recharge</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Status</span>
              <select
                value={editor.status}
                onChange={e => setEditor({...editor, status: e.target.value as CampaignStatus})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            {editorError ? <p className={styles.errorBanner}>{editorError}</p> : null}

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setEditor(null)}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={saving}>
                {saving ? 'Saving…' : editor.id ? 'Save changes' : 'Create campaign'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {reportFor ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal} style={{maxWidth: 880}}>
            <div className={styles.modalHeader}>
              <h2>{reportFor.name} — report</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setReportFor(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className={styles.summaryGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Callers enrolled</div>
                <div className={styles.statValue}>{formatNumber(reportFor.enrolledCallers)}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Completed</div>
                <div className={styles.statValue}>{formatNumber(reportFor.completedCallers)}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Coins distributed</div>
                <div className={styles.statValue}>{formatNumber(reportFor.coinsDistributed)}</div>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Caller</th>
                    <th>Recharge</th>
                    <th>Days claimed</th>
                    <th>Total coins</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportLoading ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        Loading…
                      </td>
                    </tr>
                  ) : null}
                  {!reportLoading && reportRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        <EmptyTableState label="No callers have recharged for this campaign yet." />
                      </td>
                    </tr>
                  ) : null}
                  {reportRows.map(row => (
                    <tr key={`${row.callerId}-${row.startDate}`} className={styles.clickRow} onClick={() => void openHistory(row)}>
                      <td>
                        <button type="button" className={styles.linkBtn}>
                          {row.callerName}
                        </button>
                      </td>
                      <td>
                        {formatInr(row.rechargeAmountInr)}
                        {row.rechargeCount > 1 ? <span className={styles.muted}> · {row.rechargeCount} recharges</span> : null}
                      </td>
                      <td>
                        {row.daysClaimed} / {row.totalDays}
                      </td>
                      <td className={styles.coins}>{formatNumber(row.totalCoins)}</td>
                      <td>
                        <span className={styles.pill}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {history ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal} style={{maxWidth: 560}}>
            <div className={styles.modalHeader}>
              <h2>{history.callerName} — claims</h2>
              <button type="button" className={styles.iconBtn} onClick={() => setHistory(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p className={styles.muted}>
              Status: {history.status ?? 'not enrolled'} · Run started {history.startDate ?? '—'} · Total{' '}
              {formatNumber(history.totalCoins)} coins
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Coins</th>
                    <th>Claimed on (IST)</th>
                  </tr>
                </thead>
                <tbody>
                  {history.claims.length === 0 ? (
                    <tr>
                      <td colSpan={3} className={styles.emptyCell}>
                        <EmptyTableState label="No claims yet." />
                      </td>
                    </tr>
                  ) : (
                    history.claims.map(claim => (
                      <tr key={`${claim.runStartDate}-${claim.day}`}>
                        <td>Day {claim.day}</td>
                        <td className={styles.coins}>{formatNumber(claim.coins)}</td>
                        <td>{claim.claimDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
