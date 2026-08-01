import {useEffect} from 'react';
import {Download, FileText, Film, Image, X} from 'lucide-react';
import {
  TicketCategoryTag,
  TicketStatusBadge,
  TicketUserTypeBadge,
} from '../TicketBadge/TicketBadge';
import type {TicketItem} from '../../../api/reports';
import styles from './TicketDetailsModal.module.css';

type TicketDetailsModalProps = {
  ticket: TicketItem;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onIgnore: () => void;
  onTerminate: () => void;
};

function AttachmentIcon({type}: {type: TicketItem['attachments'][number]['type']}) {
  if (type === 'video') return <Film size={16} />;
  if (type === 'pdf') return <FileText size={16} />;
  return <Image size={16} />;
}

export function TicketDetailsModal({
  ticket,
  busy = false,
  error = '',
  onClose,
  onIgnore,
  onTerminate,
}: TicketDetailsModalProps) {
  const isOpen = ticket.status === 'open';

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
              Report Details {ticket.code}
            </h2>
            <p className={styles.meta}>Created: {ticket.createdLabel}</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close report details"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.main}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Report Information</h3>
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
                  <dt>Reported By</dt>
                  <dd>
                    {ticket.reportBy} #{ticket.reportById}
                  </dd>
                </div>
                <div>
                  <dt>Reporter Type</dt>
                  <dd>
                    <TicketUserTypeBadge type={ticket.userType} />
                  </dd>
                </div>
                <div>
                  <dt>Reported User</dt>
                  <dd>
                    {ticket.reportTo} #{ticket.reportToId}
                  </dd>
                </div>
                {ticket.reportedRole ? (
                  <div>
                    <dt>Reported Role</dt>
                    <dd>
                      <TicketUserTypeBadge type={ticket.reportedRole} />
                    </dd>
                  </div>
                ) : null}
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
              <TicketStatusBadge status={ticket.status} />
            </div>

            {ticket.adminAction && ticket.adminAction !== 'none' ? (
              <p className={styles.actionHint}>
                Admin action: {ticket.adminAction}
              </p>
            ) : null}

            {error ? <p className={styles.errorText}>{error}</p> : null}

            {isOpen ? (
              <>
                <p className={styles.actionHint}>
                  Ignore closes this report without punishing the user.
                  Terminate blocks/terminates the reported account.
                </p>
                <button
                  type="button"
                  className={styles.outlineBtn}
                  disabled={busy}
                  onClick={onIgnore}
                >
                  Ignore
                </button>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  disabled={busy}
                  onClick={onTerminate}
                >
                  Terminate User
                </button>
              </>
            ) : (
              <p className={styles.actionHint}>
                This report is already {ticket.status}.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
