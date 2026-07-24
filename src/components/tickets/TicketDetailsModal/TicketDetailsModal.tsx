import {useEffect, useState} from 'react';
import {Download, FileText, Film, Image, X} from 'lucide-react';
import {
  TicketCategoryTag,
  TicketStatusBadge,
  TicketUserTypeBadge,
} from '../TicketBadge/TicketBadge';
import type {TicketItem, TicketStatus} from '../../../data/tickets';
import styles from './TicketDetailsModal.module.css';

type TicketDetailsModalProps = {
  ticket: TicketItem;
  onClose: () => void;
  onSave: (next: {
    status: TicketStatus;
    assignedToAdmin: boolean;
  }) => void;
};

function AttachmentIcon({type}: {type: TicketItem['attachments'][number]['type']}) {
  if (type === 'video') return <Film size={16} />;
  if (type === 'pdf') return <FileText size={16} />;
  return <Image size={16} />;
}

export function TicketDetailsModal({
  ticket,
  onClose,
  onSave,
}: TicketDetailsModalProps) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [assignedToAdmin, setAssignedToAdmin] = useState(ticket.assignedToAdmin);

  useEffect(() => {
    setStatus(ticket.status);
    setAssignedToAdmin(ticket.assignedToAdmin);
  }, [ticket]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-details-title"
        onClick={event => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="ticket-details-title" className={styles.title}>
              Ticket Details {ticket.code}
            </h2>
            <p className={styles.meta}>
              Created: {ticket.createdLabel}
              {assignedToAdmin ? ' · Assigned to Admin Team' : ''}
            </p>
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
              <h3 className={styles.sectionTitle}>Ticket Information</h3>
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
                  <dt>User Name</dt>
                  <dd>
                    {ticket.reportBy} #{ticket.reportById}
                  </dd>
                </div>
                <div>
                  <dt>User Type</dt>
                  <dd>
                    <TicketUserTypeBadge type={ticket.userType} />
                  </dd>
                </div>
                <div>
                  <dt>Reported To</dt>
                  <dd>
                    {ticket.reportTo} #{ticket.reportToId}
                  </dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Issue Details</h3>
              <div className={styles.tags}>
                {ticket.categories.map(category => (
                  <TicketCategoryTag key={category} label={category} />
                ))}
              </div>
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
                        <span>{file.sizeLabel}</span>
                      </div>
                      <button type="button" className={styles.downloadBtn}>
                        <Download size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className={styles.side}>
            <div className={styles.statusBlock}>
              <p className={styles.sideLabel}>Current Status</p>
              <TicketStatusBadge status={status} />
            </div>

            <label className={styles.field}>
              <span>Update Status</span>
              <select
                value={status}
                onChange={event =>
                  setStatus(event.target.value as TicketStatus)
                }
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => onSave({status, assignedToAdmin})}
            >
              Update Status
            </button>
            <button
              type="button"
              className={styles.outlineBtn}
              onClick={() => onSave({status, assignedToAdmin})}
            >
              Save Changes
            </button>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={assignedToAdmin}
                onChange={event => setAssignedToAdmin(event.target.checked)}
              />
              Assigned To Admin Team
            </label>
          </aside>
        </div>
      </div>
    </div>
  );
}
