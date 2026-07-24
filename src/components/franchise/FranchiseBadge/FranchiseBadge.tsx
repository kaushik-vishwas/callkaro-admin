import type {
  FranchiseAccountStatus,
  FranchiseKycStatus,
} from '../../../data/franchises';
import styles from './FranchiseBadge.module.css';

const kycLabels: Record<FranchiseKycStatus, string> = {
  verified: 'Verified',
  under_review: 'Under Review',
  pending: 'Pending',
  rejected: 'Rejected',
};

const accountLabels: Record<FranchiseAccountStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

export function FranchiseKycBadge({status}: {status: FranchiseKycStatus}) {
  return (
    <span className={[styles.badge, styles[`kyc_${status}`]].join(' ')}>
      {kycLabels[status]}
    </span>
  );
}

export function FranchiseAccountBadge({
  status,
}: {
  status: FranchiseAccountStatus;
}) {
  return (
    <span className={[styles.badge, styles[`account_${status}`]].join(' ')}>
      {accountLabels[status]}
    </span>
  );
}
