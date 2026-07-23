import type {CallerStatus} from '../../../data/callers';
import styles from './StatusBadge.module.css';

const labels: Record<CallerStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  blocked: 'BLOCKED',
  suspended: 'SUSPENDED',
};

export function StatusBadge({status}: {status: CallerStatus}) {
  return (
    <span className={[styles.badge, styles[status]].join(' ')}>
      {labels[status]}
    </span>
  );
}
