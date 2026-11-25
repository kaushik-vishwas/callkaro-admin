import type {ReceiverStatus} from '../../../data/receivers';
import type {ReceiverStage} from '../../../api/receivers';
import styles from './ReceiverStatusBadge.module.css';

const STAGE_LABELS: Record<ReceiverStage, string> = {
  draft: 'Draft',
  pending: 'Pending',
  active: 'Approved',
  suspended: 'Suspended',
  // Admin block is shown the same as a suspension.
  blocked: 'Suspended',
  rejected: 'Rejected',
};

// Fallback when an older backend only sends the simplified status.
const SIMPLE_TO_STAGE: Record<ReceiverStatus, ReceiverStage> = {
  active: 'active',
  inactive: 'suspended',
  blocked: 'blocked',
};

export function ReceiverStatusBadge({
  status,
  stage,
}: {
  status: ReceiverStatus;
  stage?: ReceiverStage | string | null;
}) {
  const resolved: ReceiverStage =
    stage && stage in STAGE_LABELS
      ? (stage as ReceiverStage)
      : SIMPLE_TO_STAGE[status] ?? 'pending';

  return (
    <span className={[styles.badge, styles[resolved]].join(' ')}>
      {STAGE_LABELS[resolved]}
    </span>
  );
}
