import type {CallerStatus} from '../../../data/callers';
import styles from './StatusBadge.module.css';

// Same wording as receivers: blocked and suspended both read "Suspended".
const labels: Record<CallerStatus, string> = {
  active: 'Enabled',
  inactive: 'Suspended',
  blocked: 'Suspended',
  suspended: 'Suspended',
};

const tone: Record<CallerStatus, string> = {
  active: 'active',
  inactive: 'suspended',
  blocked: 'suspended',
  suspended: 'suspended',
};

export function StatusBadge({status}: {status: CallerStatus}) {
  return (
    <span className={[styles.badge, styles[tone[status] ?? 'suspended']].join(' ')}>
      {labels[status] ?? 'Suspended'}
    </span>
  );
}
