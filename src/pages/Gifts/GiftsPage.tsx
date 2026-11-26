import {useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent} from 'react';
import {ImagePlus, Loader2, Pencil, Plus, RotateCcw, Trash2, Upload, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  createGift,
  deleteGift,
  fetchGiftSummary,
  fetchGiftTransactions,
  fetchGifts,
  updateGift,
  updateGiftSplit,
  uploadGiftMedia,
  type AdminGift,
  type GiftCategory,
  type GiftInput,
  type GiftSplit,
  type GiftStatus,
  type GiftSummary,
  type GiftTransactionItem,
} from '../../api/gifts';
import {formatInr, formatNumber} from '../../api/receivers';
import styles from './GiftsPage.module.css';

const ACCEPTED_MEDIA = 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm';
const DEFAULT_SPLIT: GiftSplit = {adminPercent: 80, receiverPercent: 15, agentPercent: 5};
const SAMPLE_COINS = 500;

type FormState = {
  id?: string;
  name: string;
  category: GiftCategory;
  coins: string;
  status: GiftStatus;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: 'Basic',
  coins: '',
  status: 'active',
};

const DEFAULT_CATEGORIES: GiftCategory[] = ['Basic', 'Romantic', 'Premium', 'Luxury'];

function validateGift(form: FormState): string {
  if (!form.name.trim()) return 'Gift name is required.';
  const coins = Number(form.coins);
  if (!Number.isInteger(coins) || coins <= 0) {
    return 'Price must be a whole number of coins greater than 0.';
  }
  return '';
}

function splitTotal(split: GiftSplit) {
  return (
    Math.round((split.adminPercent + split.receiverPercent + split.agentPercent) * 100) /
    100
  );
}

/** Live example of how SAMPLE_COINS would be divided with the current draft. */
function splitExample(split: GiftSplit) {
  const receiver = Math.floor((SAMPLE_COINS * split.receiverPercent) / 100);
  const agent = Math.floor((SAMPLE_COINS * split.agentPercent) / 100);
  return {receiver, agent, admin: SAMPLE_COINS - receiver - agent};
}

function pct(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function GiftsPage() {
  const [gifts, setGifts] = useState<AdminGift[]>([]);
  const [categories, setCategories] = useState<GiftCategory[]>(DEFAULT_CATEGORIES);
  const [split, setSplit] = useState<GiftSplit>(DEFAULT_SPLIT);
  const [summary, setSummary] = useState<GiftSummary | null>(null);
  const [transactions, setTransactions] = useState<GiftTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [splitDraft, setSplitDraft] = useState<GiftSplit | null>(null);

  // Image state for the modal: a file picked before the gift exists (create mode)
  // or a live upload for an existing gift (edit mode).
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const tableFileInput = useRef<HTMLInputElement>(null);
  const modalFileInput = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [giftsRes, summaryRes, txRes] = await Promise.all([
        fetchGifts(),
        fetchGiftSummary(),
        fetchGiftTransactions(25),
      ]);
      setGifts(giftsRes.gifts || []);
      if (giftsRes.categories?.length) setCategories(giftsRes.categories);
      setSplit(giftsRes.split);
      setSummary(summaryRes.summary);
      setTransactions(txRes.items || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load gifts.');
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

  // Release object URLs for previews.
  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  function clearPendingImage() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview(null);
    setPendingFile(null);
  }

  function closeForm() {
    clearPendingImage();
    setForm(null);
  }

  function openCreate() {
    setFormError('');
    clearPendingImage();
    setForm({...EMPTY_FORM});
  }

  function openEdit(gift: AdminGift) {
    setFormError('');
    clearPendingImage();
    setForm({
      id: gift.id,
      name: gift.name,
      category: gift.category,
      coins: String(gift.coins),
      status: gift.status,
    });
  }

  /** Validate and set a picked file; in edit mode it uploads right away. */
  async function acceptFile(file: File) {
    const allowed = ACCEPTED_MEDIA.split(',');
    if (!allowed.includes(file.type)) {
      setFormError('Use a PNG, JPEG, WebP, GIF, MP4 or WebM file.');
      return;
    }
    if (form?.id) {
      setFormError('');
      setBusyId(form.id);
      try {
        await uploadGiftMedia(form.id, file);
        setNotice('Gift image updated.');
        await load();
        // Refresh the modal's gift without closing it.
        setForm(current => (current ? {...current} : current));
      } catch (err) {
        setFormError(err instanceof ApiError ? err.message : 'Upload failed.');
      } finally {
        setBusyId(null);
      }
      return;
    }
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setFormError('');
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    const problem = validateGift(form);
    if (problem) {
      setFormError(problem);
      return;
    }
    const payload: GiftInput = {
      name: form.name.trim(),
      category: form.category,
      coins: Number(form.coins),
      status: form.status,
    };
    setSaving(true);
    setFormError('');
    try {
      if (form.id) {
        await updateGift(form.id, payload);
        setNotice('Gift updated. Existing sends keep their original price.');
      } else {
        const created = await createGift(payload);
        if (pendingFile) {
          try {
            await uploadGiftMedia(created.gift.id, pendingFile);
          } catch (err) {
            setNotice('');
            setError(
              `Gift saved, but the image failed to upload: ${
                err instanceof ApiError ? err.message : 'unknown error'
              }. Open the gift and try again.`,
            );
          }
        }
        setNotice('Gift added.');
      }
      closeForm();
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save gift.');
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(gift: AdminGift) {
    setBusyId(gift.id);
    setError('');
    try {
      await updateGift(gift.id, {
        status: gift.status === 'active' ? 'inactive' : 'active',
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status.');
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(gift: AdminGift) {
    if (!window.confirm(`Delete "${gift.name}"? Gifts that were already sent cannot be deleted.`)) {
      return;
    }
    setBusyId(gift.id);
    setError('');
    try {
      await deleteGift(gift.id);
      setNotice('Gift deleted.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete gift.');
    } finally {
      setBusyId(null);
    }
  }

  function startTableUpload(gift: AdminGift) {
    setUploadTargetId(gift.id);
    tableFileInput.current?.click();
  }

  async function onTableFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !uploadTargetId) return;
    setBusyId(uploadTargetId);
    setError('');
    try {
      await uploadGiftMedia(uploadTargetId, file);
      setNotice('Gift image uploaded.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setBusyId(null);
      setUploadTargetId(null);
    }
  }

  function onModalFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void acceptFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void acceptFile(file);
  }

  async function onSaveSplit(event: FormEvent) {
    event.preventDefault();
    if (!splitDraft) return;
    setSaving(true);
    setError('');
    try {
      const res = await updateGiftSplit(splitDraft);
      setSplit(res.split);
      setSplitDraft(null);
      setNotice('Gift revenue split updated.');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update split.');
    } finally {
      setSaving(false);
    }
  }

  const draft = splitDraft ?? split;
  const draftTotal = splitTotal(draft);
  const totalOk = draftTotal === 100;
  const example = splitExample(draft);
  const editing = Boolean(form?.id);
  const editingGift = editing ? gifts.find(g => g.id === form?.id) : undefined;
  const previewSrc = pendingPreview || editingGift?.mediaUrl || null;
  // Existing video animations (mp4/webm) need a <video>; images and GIFs use <img>.
  const previewIsVideo =
    !pendingPreview && /\.(mp4|webm)(\?|$)/i.test(editingGift?.mediaUrl || '');

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gifts</h1>
            <p className={styles.subtitle}>
              Manage the gift catalog, prices and the revenue split for gifts sent on calls.
            </p>
          </div>
          <button type="button" className={styles.primaryBtn} onClick={openCreate}>
            <Plus size={16} /> Add Gift
          </button>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        {summary ? (
          <div className={styles.summaryGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Gifts sent</div>
              <div className={styles.statValue}>{formatNumber(summary.giftsSent)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Gift revenue (coins)</div>
              <div className={styles.statValue}>{formatNumber(summary.totalCoins)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Admin share</div>
              <div className={styles.statValue}>{formatInr(summary.adminInr)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Receiver earnings</div>
              <div className={styles.statValue}>{formatInr(summary.receiverInr)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Agent commission</div>
              <div className={styles.statValue}>{formatInr(summary.agentInr)}</div>
            </div>
            {summary.failedCredits > 0 ? (
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Failed credits</div>
                <div className={styles.statValue}>{summary.failedCredits}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        <h2 className={styles.sectionTitle}>Revenue split (gifts)</h2>
        <section className={styles.splitPanel}>
          <form onSubmit={onSaveSplit}>
            <div className={styles.splitGrid}>
              <SplitCard
                tone="admin"
                label="Admin / Platform"
                hint="Platform keeps this share"
                value={draft.adminPercent}
                onChange={v => setSplitDraft({...draft, adminPercent: v})}
              />
              <SplitCard
                tone="receiver"
                label="Receiver"
                hint="Paid to the receiver's wallet"
                value={draft.receiverPercent}
                onChange={v => setSplitDraft({...draft, receiverPercent: v})}
              />
              <SplitCard
                tone="agent"
                label="Agent"
                hint="Goes to the receiver's agent (admin if none)"
                value={draft.agentPercent}
                onChange={v => setSplitDraft({...draft, agentPercent: v})}
              />
            </div>

            <div className={styles.splitBar} aria-label="Split preview">
              <div className={styles.barAdmin} style={{width: `${pct(draft.adminPercent)}%`}} />
              <div className={styles.barReceiver} style={{width: `${pct(draft.receiverPercent)}%`}} />
              <div className={styles.barAgent} style={{width: `${pct(draft.agentPercent)}%`}} />
            </div>

            <div className={styles.splitFooter}>
              <div className={styles.splitMeta}>
                <span className={totalOk ? styles.totalOk : styles.totalBad}>
                  Total {draftTotal}% {totalOk ? '✓' : '— must equal 100%'}
                </span>
                <span className={styles.splitHint}>
                  Example {formatNumber(SAMPLE_COINS)} coins → admin{' '}
                  {formatNumber(example.admin)} · receiver {formatNumber(example.receiver)} · agent{' '}
                  {formatNumber(example.agent)}
                </span>
              </div>
              <div className={styles.splitActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  disabled={!splitDraft}
                  onClick={() => setSplitDraft(null)}
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={!splitDraft || !totalOk || saving}
                >
                  {saving ? 'Saving…' : 'Save split'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <h2 className={styles.sectionTitle}>Gift catalog</h2>
        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Gift</th>
                  <th>Category</th>
                  <th>Price (coins)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      Loading gifts…
                    </td>
                  </tr>
                ) : null}
                {!loading && gifts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      <EmptyTableState label="No gifts yet. Click Add Gift." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? gifts.map((gift, index) => {
                      const uploading = busyId === gift.id;
                      return (
                        <tr key={gift.id}>
                          <td className={styles.serial}>{index + 1}</td>
                          <td>
                            <div className={styles.giftCell}>
                              <div className={styles.thumb}>
                                {gift.mediaUrl && gift.mediaType !== 'animation' ? (
                                  <img src={gift.mediaUrl} alt={gift.name} />
                                ) : (
                                  <span className={styles.thumbEmoji}>{gift.emoji}</span>
                                )}
                              </div>
                              <span className={styles.giftName}>{gift.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={styles.categoryPill}>{gift.category}</span>
                          </td>
                          <td className={styles.coins}>{formatNumber(gift.coins)}</td>
                          <td>
                            <button
                              type="button"
                              className={
                                gift.status === 'active' ? styles.statusActive : styles.statusInactive
                              }
                              onClick={() => void onToggleStatus(gift)}
                              disabled={uploading}
                              title="Click to toggle"
                            >
                              {gift.status === 'active' ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                type="button"
                                className={styles.imageBtn}
                                onClick={() => startTableUpload(gift)}
                                disabled={uploading}
                                aria-label={`${gift.mediaUrl ? 'Replace' : 'Upload'} image for ${gift.name}`}
                              >
                                {uploading ? (
                                  <Loader2 size={14} className={styles.spin} />
                                ) : (
                                  <ImagePlus size={14} />
                                )}
                                {uploading ? 'Uploading…' : gift.mediaUrl ? 'Replace image' : 'Upload image'}
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title="Edit"
                                aria-label={`Edit ${gift.name}`}
                                onClick={() => openEdit(gift)}
                                disabled={uploading}
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtnDanger}
                                title="Delete"
                                aria-label={`Delete ${gift.name}`}
                                onClick={() => void onDelete(gift)}
                                disabled={uploading}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
          <input
            ref={tableFileInput}
            type="file"
            accept={ACCEPTED_MEDIA}
            onChange={onTableFileChosen}
            hidden
          />
        </section>

        <h2 className={styles.sectionTitle}>Recent gift transactions</h2>
        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Gift</th>
                  <th>Qty</th>
                  <th>Total coins</th>
                  <th>Admin / Receiver / Agent (coins)</th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      <EmptyTableState label="No gifts sent yet." />
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleString('en-IN')}</td>
                      <td>
                        {tx.giftEmoji} {tx.giftName}
                      </td>
                      <td>{tx.quantity}</td>
                      <td className={styles.coins}>{formatNumber(tx.totalCoins)}</td>
                      <td>
                        {formatNumber(tx.adminCoins)} / {formatNumber(tx.receiverCoins)} /{' '}
                        {formatNumber(tx.agentCoins)}
                      </td>
                      <td>{tx.creditStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {form ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <form className={styles.modal} onSubmit={onSubmit}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Gift' : 'Add Gift'}</h2>
              <button type="button" className={styles.iconBtn} onClick={closeForm} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className={styles.mediaSection}>
              <span className={styles.mediaLabel}>Gift image</span>
              <div
                className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''}`}
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => modalFileInput.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') modalFileInput.current?.click();
                }}
              >
                {busyId && editing && busyId === form.id ? (
                  <div className={styles.dropzoneBusy}>
                    <Loader2 size={22} className={styles.spin} />
                    <span>Uploading…</span>
                  </div>
                ) : previewSrc ? (
                  previewIsVideo ? (
                    <video className={styles.dropzonePreview} src={previewSrc} muted autoPlay loop />
                  ) : (
                    <img className={styles.dropzonePreview} src={previewSrc} alt="Gift preview" />
                  )
                ) : (
                  <div className={styles.dropzoneEmpty}>
                    <Upload size={22} />
                    <strong>Drop an image here or click to choose</strong>
                    <span>PNG, JPEG, WebP, GIF, MP4 or WebM · up to 10 MB</span>
                  </div>
                )}
              </div>
              <div className={styles.dropzoneFooter}>
                <button
                  type="button"
                  className={styles.imageBtn}
                  onClick={() => modalFileInput.current?.click()}
                  disabled={busyId === form.id}
                >
                  <ImagePlus size={14} />
                  {previewSrc ? 'Replace image' : 'Choose image'}
                </button>
                <span className={styles.muted}>
                  {pendingFile
                    ? `Will upload "${pendingFile.name}" when you add the gift.`
                    : editing
                      ? 'Images upload immediately.'
                      : 'Saved together with the gift.'}
                </span>
              </div>
              <input
                ref={modalFileInput}
                type="file"
                accept={ACCEPTED_MEDIA}
                onChange={onModalFileChosen}
                hidden
              />
            </div>

            <label className={styles.field}>
              <span>Name</span>
              <input
                type="text"
                maxLength={60}
                placeholder="e.g. Rose"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </label>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value as GiftCategory})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>Price (coins)</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={form.coins}
                  onChange={e => setForm({...form, coins: e.target.value})}
                  required
                />
              </label>
              <label className={styles.field}>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value as GiftStatus})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            {formError ? <p className={styles.errorBanner}>{formError}</p> : null}

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add gift'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardShell>
  );
}

function SplitCard({
  tone,
  label,
  hint,
  value,
  onChange,
}: {
  tone: 'admin' | 'receiver' | 'agent';
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={`${styles.splitCard} ${styles[`tone_${tone}`]}`}>
      <div className={styles.splitCardHead}>
        <span className={styles.toneDot} />
        <span className={styles.splitCardLabel}>{label}</span>
      </div>
      <div className={styles.percentInput}>
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          aria-label={`${label} percent`}
        />
        <span>%</span>
      </div>
      <span className={styles.splitHint}>{hint}</span>
    </div>
  );
}
