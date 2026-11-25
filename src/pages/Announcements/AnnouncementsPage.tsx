import {useEffect, useState, type FormEvent} from 'react';
import {Send} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {EmptyTableState} from '../../components/shared/EmptyTableState/EmptyTableState';
import {ApiError} from '../../api/client';
import {
  fetchAnnouncements,
  sendAnnouncement,
  type Announcement,
  type AnnouncementKind,
} from '../../api/announcements';
import {formatNumber} from '../../api/receivers';
import styles from './AnnouncementsPage.module.css';

const KIND_LABEL: Record<AnnouncementKind, string> = {
  announcement: 'Announcement',
  offer: 'Offer',
};

function formatWhen(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AnnouncementsPage() {
  const [history, setHistory] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [kind, setKind] = useState<AnnouncementKind>('announcement');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAnnouncements()
      .then(result => {
        if (!cancelled) setHistory(result.announcements || []);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load announcements.');
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
    const id = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Add a title and a message.');
      return;
    }
    if (!window.confirm(`Send this ${KIND_LABEL[kind].toLowerCase()} to all active callers?`)) {
      return;
    }
    setSending(true);
    setError('');
    try {
      const result = await sendAnnouncement({kind, title: title.trim(), body: body.trim()});
      setNotice(`Sent to ${formatNumber(result.announcement.recipients)} callers.`);
      setTitle('');
      setBody('');
      setReloadKey(key => key + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send.');
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Announcements & Offers</h1>
          <p className={styles.subtitle}>
            Send a message to every active caller’s notification inbox. Blocked
            accounts are skipped.
          </p>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? (
          <p className={styles.noticeBanner} role="status">
            {notice}
          </p>
        ) : null}

        <form className={styles.composer} onSubmit={onSubmit}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Type</span>
              <select
                value={kind}
                onChange={event => setKind(event.target.value as AnnouncementKind)}
              >
                <option value="announcement">Announcement</option>
                <option value="offer">Offer</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Title ({title.length}/80)</span>
              <input
                value={title}
                maxLength={80}
                onChange={event => setTitle(event.target.value)}
                placeholder="e.g. Weekend bonus on recharge"
              />
            </label>
          </div>
          <label className={styles.field}>
            <span>Message ({body.length}/500)</span>
            <textarea
              value={body}
              maxLength={500}
              rows={3}
              onChange={event => setBody(event.target.value)}
              placeholder="What callers should know"
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn} disabled={sending}>
              <Send size={14} /> {sending ? 'Sending…' : 'Send to callers'}
            </button>
          </div>
        </form>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Sent history</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sent</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Recipients</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      <EmptyTableState label="Nothing sent yet." />
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? history.map(item => (
                      <tr key={item.id}>
                        <td>{formatWhen(item.createdAt)}</td>
                        <td>{KIND_LABEL[item.kind]}</td>
                        <td className={styles.strong}>{item.title}</td>
                        <td className={styles.message}>{item.body}</td>
                        <td>{formatNumber(item.recipients)}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
