import {useEffect, useState} from 'react';
import {Download, FileText, Image, X} from 'lucide-react';
import {
  SupportTicketStatusBadge,
  TicketCategoryTag,
  TicketUserTypeBadge,
} from '../TicketBadge/TicketBadge';
import type {
  SupportTicketItem,
  SupportTicketStatus,
} from '../../../api/supportTickets';
import styles from './TicketDetailsModal.module.css';

type Props = {
  ticket: SupportTicketItem;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onUpdateStatus: (input: {
    status: SupportTicketStatus;
    adminNote?: string;
  }) => void;
};

function AttachmentIcon({
  type,
}: {
  type: SupportTicketItem['attachments'][number]['type'];
}) {
  if (type === 'pdf') return <FileText size={16} />;
  return <Image size={16} />;
}

export function SupportTicketDetailsModal({
  ticket,
  busy = false,
  error = '',
  onClose,
  onUpdateStatus,
}: Props) {
  const [status, setStatus] = useState<SupportTicketStatus>(ticket.status);
  const [adminNote, setAdminNote] = useState(ticket.adminNote || '');

  useEffect(() => {
    setStatus(ticket.status);
    setAdminNote(ticket.adminNote || '');
  }, [ticket.id, ticket.status, ticket.adminNote]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dirty =
    status !== ticket.status ||
    adminNote.trim() !== String(ticket.adminNote || '').trim();

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-ticket-title"
        onClick={event => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="support-ticket-title" className={styles.title}>
              Support Ticket {ticket.code}
            </h2>
            <p className={styles.meta}>Created: {ticket.createdLabel}</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close ticket details"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.main}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>User Information</h3>
              <dl className={styles.infoGrid}>
                <div>
                  <dt>Ticket ID</dt>
                  <dd>{ticket.code}</dd>
                </div>
                <div>
                  <dt>Created Date</dt>
                  <dd>{ticket.createdLabel}</dd>
                </div>
                <div>
                  <dt>Submitted By</dt>
                  <dd>
                    {ticket.userName} #{ticket.userId}
                  </dd>
                </div>
                <div>
                  <dt>User Type</dt>
                  <dd>
                    <TicketUserTypeBadge type={ticket.role} />
                  </dd>
                </div>
                <div>
                  <dt>Contact Email</dt>
                  <dd>{ticket.email || ticket.userEmail || '—'}</dd>
                </div>
                <div>
                  <dt>Contact Mobile</dt>
                  <dd>{ticket.mobile || ticket.userPhone || '—'}</dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Issue Details</h3>
              <div className={styles.tags}>
                <TicketCategoryTag label={ticket.category} />
              </div>
              <p className={styles.description}>
                <strong>{ticket.subject}</strong>
              </p>
              <p className={styles.description}>{ticket.description}</p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Uploaded Attachments</h3>
              {ticket.attachments.length === 0 ? (
                <p className={styles.empty}>No attachments uploaded.</p>
              ) : (
                <ul className={styles.attachments}>
                  {ticket.attachments.map(file => (
                    <li key={file.id}>
                      <span className={styles.fileIcon}>
                        <AttachmentIcon type={file.type} />
                      </span>
                      <div>
                        <p>{file.name}</p>
                        <span>{file.sizeLabel || file.type}</span>
                      </div>
                      {file.url ? (
                        <a
                          className={styles.downloadBtn}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${file.name}`}
                        >
                          <Download size={15} />
                        </a>
                      ) : (
                        <span className={styles.downloadBtn}>
                          <Download size={15} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className={styles.side}>
            <div className={styles.statusBlock}>
              <p className={styles.sideLabel}>Current Status</p>
              <SupportTicketStatusBadge status={ticket.status} />
            </div>

            <label className={styles.sideLabel} htmlFor="support-status">
              Update Status
            </label>
            <select
              id="support-status"
              className={styles.select}
              value={status}
              disabled={busy}
              onChange={event =>
                setStatus(event.target.value as SupportTicketStatus)
              }
            >
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="solved">Solved</option>
              <option value="closed">Closed</option>
            </select>

            <label className={styles.sideLabel} htmlFor="support-note">
              Admin Note
            </label>
            <textarea
              id="support-note"
              className={styles.textarea}
              rows={4}
              value={adminNote}
              disabled={busy}
              placeholder="Internal note visible to the user on ticket details"
              onChange={event => setAdminNote(event.target.value)}
            />

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <button
              type="button"
              className={styles.outlineBtn}
              disabled={busy || !dirty}
              onClick={() =>
                onUpdateStatus({
                  status,
                  adminNote: adminNote.trim(),
                })
              }
            >
              {busy ? 'Saving…' : 'Save Changes'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
