import type {TicketStatus, TicketUserType} from '../../../data/tickets';
import type {SupportTicketStatus} from '../../../api/supportTickets';
import styles from './TicketBadge.module.css';

export function TicketStatusBadge({status}: {status: TicketStatus}) {
  const label =
    status === 'open' ? 'Open' : status === 'ignored' ? 'Ignored' : 'Resolved';
  return (
    <span className={[styles.badge, styles[`status_${status}`]].join(' ')}>
      {label}
    </span>
  );
}

export function SupportTicketStatusBadge({
  status,
}: {
  status: SupportTicketStatus | string;
}) {
  const key = String(status || 'open');
  const label =
    key === 'in_review'
      ? 'In Review'
      : key === 'solved'
        ? 'Solved'
        : key === 'closed'
          ? 'Closed'
          : 'Open';
  const classKey =
    key === 'in_review'
      ? 'status_in_review'
      : key === 'solved'
        ? 'status_solved'
        : key === 'closed'
          ? 'status_closed'
          : 'status_open';
  return (
    <span className={[styles.badge, styles[classKey]].join(' ')}>{label}</span>
  );
}

export function TicketUserTypeBadge({type}: {type: TicketUserType}) {
  const label =
    type === 'caller' ? 'Caller' : type === 'receiver' ? 'Receiver' : 'Agent';
  return (
    <span className={[styles.badge, styles[`type_${type}`]].join(' ')}>
      {label}
    </span>
  );
}

export function TicketCategoryTag({label}: {label: string}) {
  return <span className={styles.tag}>{label}</span>;
}
