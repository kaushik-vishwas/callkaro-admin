import type {ReceiverStatus} from '../../../data/receivers';
import styles from './ReceiverStatusBadge.module.css';

const labels: Record<ReceiverStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  blocked: 'BLOCKED',
};

export function ReceiverStatusBadge({status}: {status: ReceiverStatus}) {
  return (
    <span className={[styles.badge, styles[status]].join(' ')}>
      {labels[status]}
    </span>
  );
}
