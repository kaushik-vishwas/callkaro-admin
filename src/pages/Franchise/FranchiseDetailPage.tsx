import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  Check,
  Download,
  Eye,
  KeyRound,
  PauseCircle,
  PlayCircle,
  Users,
  Wallet,
} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {
  FranchiseAccountBadge,
  FranchiseKycBadge,
} from '../../components/franchise/FranchiseBadge/FranchiseBadge';
import {
  formatInrCompact,
  formatNumber,
  getFranchiseById,
} from '../../data/franchises';
import styles from './FranchiseDetailPage.module.css';

export function FranchiseDetailPage() {
  const {franchiseId = ''} = useParams();
  const navigate = useNavigate();
  const franchise = getFranchiseById(franchiseId);

  if (!franchise) {
    return <Navigate to="/franchise" replace />;
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.top}>
          <div>
            <Link to="/franchise" className={styles.back}>
              <ArrowLeft size={15} strokeWidth={2.5} />
              Back to Franchises
            </Link>
            <h1 className={styles.title}>Franchise Details</h1>
            <p className={styles.subtitle}>
              View franchise information and operations.
            </p>
          </div>
        </div>

        <section className={styles.profileCard}>
          <div className={styles.profileMain}>
            <CallerAvatar name={franchise.businessName} size="lg" />
            <div>
              <div className={styles.nameRow}>
                <h2 className={styles.name}>{franchise.businessName}</h2>
                <FranchiseKycBadge status={franchise.kycStatus} />
                <FranchiseAccountBadge status={franchise.accountStatus} />
              </div>
              <p className={styles.meta}>
                Owner: {franchise.ownerName} · Franchise ID: {franchise.code}
                {franchise.approvedAt
                  ? ` · Approved: ${franchise.approvedAt}`
                  : ''}
              </p>
            </div>
          </div>
          <div className={styles.profileActions}>
            <button type="button" className={styles.btnOutline}>
              <KeyRound size={15} />
              Reset Password
            </button>
            <button type="button" className={styles.btnWarn}>
              <PauseCircle size={15} />
              Suspend
            </button>
            <button type="button" className={styles.btnDanger}>
              <Ban size={15} />
              Terminate
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Bank Information</h3>
          <dl className={styles.infoGrid}>
            <div>
              <dt>Bank Name</dt>
              <dd>{franchise.bank.bankName}</dd>
            </div>
            <div>
              <dt>Account Holder Name</dt>
              <dd>{franchise.bank.holderName}</dd>
            </div>
            <div>
              <dt>Account Number</dt>
              <dd>{franchise.bank.accountNumber}</dd>
            </div>
            <div>
              <dt>IFSC Code</dt>
              <dd>{franchise.bank.ifsc}</dd>
            </div>
          </dl>
          {franchise.bank.verified ? (
            <div className={styles.bankVerified}>
              <Check size={15} strokeWidth={2.75} />
              Bank Account Verified
            </div>
          ) : (
            <div className={styles.bankPending}>Bank verification pending</div>
          )}
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Performance Overview</h3>
          <div className={styles.perfGrid}>
            <article>
              <p>Total Callers</p>
              <strong>{formatNumber(franchise.performance.totalCallers)}</strong>
            </article>
            <article>
              <p>Total Receivers</p>
              <strong>
                {formatNumber(franchise.performance.totalReceivers)}
              </strong>
            </article>
            <article>
              <p>Total Groups</p>
              <strong>{formatNumber(franchise.performance.totalGroups)}</strong>
            </article>
            <article>
              <p>Revenue Generated</p>
              <strong>
                {formatInrCompact(franchise.performance.revenueGenerated)}
              </strong>
            </article>
            <article>
              <p>Commission Earned</p>
              <strong>
                {formatInrCompact(franchise.performance.commissionEarned)}
              </strong>
            </article>
            <article>
              <p>Withdrawals</p>
              <strong>
                {formatInrCompact(franchise.performance.withdrawals)}
              </strong>
            </article>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Franchise Operations</h3>
          <div className={styles.opsGrid}>
            <article className={styles.opsGreen}>
              <p>Active Callers</p>
              <strong>
                {formatNumber(franchise.operations.activeCallers)}
              </strong>
            </article>
            <article className={styles.opsGreen}>
              <p>Active Receivers</p>
              <strong>
                {formatNumber(franchise.operations.activeReceivers)}
              </strong>
            </article>
            <article className={styles.opsRed}>
              <p>Suspended Accounts</p>
              <strong>
                {formatNumber(franchise.operations.suspendedAccounts)}
              </strong>
            </article>
            <article className={styles.opsGold}>
              <p>Pending Approvals</p>
              <strong>
                {formatNumber(franchise.operations.pendingApprovals)}
              </strong>
            </article>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Document Archive</h3>
          <div className={styles.docsGrid}>
            {franchise.documents.map(doc => (
              <article key={doc.id} className={styles.docCard}>
                <div className={styles.docHead}>
                  <h4>{doc.title}</h4>
                  <FranchiseKycBadge
                    status={
                      doc.status === 'verified'
                        ? 'verified'
                        : doc.status === 'rejected'
                          ? 'rejected'
                          : 'pending'
                    }
                  />
                </div>
                <p className={styles.docMeta}>Uploaded: {doc.uploadedAt}</p>
                <div className={styles.docActions}>
                  <button type="button" className={styles.docBtn}>
                    <Eye size={14} />
                    View
                  </button>
                  <button type="button" className={styles.docBtn}>
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Account Management</h3>
          <div className={styles.manageGrid}>
            <button type="button" className={styles.manageWarn}>
              <PauseCircle size={15} />
              Suspend Franchise
            </button>
            <button type="button" className={styles.manageSuccess}>
              <PlayCircle size={15} />
              Activate Franchise
            </button>
            <button type="button" className={styles.manageNeutral}>
              <KeyRound size={15} />
              Reset Credentials
            </button>
            <button type="button" className={styles.manageNeutral}>
              <Wallet size={15} />
              View Revenue
            </button>
            <button
              type="button"
              className={styles.manageNeutral}
              onClick={() => navigate('/callers')}
            >
              <Users size={15} />
              View Callers
            </button>
            <button
              type="button"
              className={styles.manageNeutral}
              onClick={() => navigate('/receivers')}
            >
              <Users size={15} />
              View Receivers
            </button>
            <button type="button" className={styles.manageNeutral}>
              <Users size={15} />
              View Groups
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
