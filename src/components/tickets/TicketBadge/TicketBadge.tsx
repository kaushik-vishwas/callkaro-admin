import type {TicketStatus, TicketUserType} from '../../../data/tickets';
import styles from './TicketBadge.module.css';

export function TicketStatusBadge({status}: {status: TicketStatus}) {
  return (
    <span className={[styles.badge, styles[`status_${status}`]].join(' ')}>
      {status === 'open' ? 'Open' : 'Resolved'}
    </span>
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
