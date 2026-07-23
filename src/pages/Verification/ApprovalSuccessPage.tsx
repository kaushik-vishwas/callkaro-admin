import {useEffect, useState} from 'react';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {CalendarDays, Check, CircleDollarSign, Medal} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {CallerAvatar} from '../../components/callers/CallerAvatar/CallerAvatar';
import {fetchReceiver, type AdminReceiverProfile} from '../../api/receivers';
import {ApiError} from '../../api/client';
import styles from './ApprovalSuccessPage.module.css';

const NEXT_STEPS = [
  {
    title: 'Receiver Notification',
    body: 'The receiver receives an email confirmation that their profile is approved.',
  },
  {
    title: 'Profile Goes Live',
    body: 'Their profile becomes visible to customers and can start receiving calls.',
  },
  {
    title: 'Earnings Tracking',
    body: 'Call time and earnings are tracked automatically with payouts on schedule.',
  },
  {
    title: 'Ongoing Support',
    body: 'You can monitor performance and support them from the admin dashboard.',
  },
];

function rateForLevel(level: number): string {
  if (level >= 3) return '₹20/min';
  if (level === 2) return '₹15/min';
  return '₹10/min';
}

export function ApprovalSuccessPage() {
  const {receiverId = ''} = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminReceiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activatedAt] = useState(() => new Date().toLocaleString('en-US'));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await fetchReceiver(receiverId);
        if (cancelled) return;
        setProfile(data.receiver);
      } catch (err) {
        if (!cancelled) {
          setNotFound(err instanceof ApiError && err.statusCode === 404);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (receiverId) void load();
    return () => {
      cancelled = true;
    };
  }, [receiverId]);

  if (loading) {
    return (
      <DashboardShell>
        <div className={styles.page}>
          <p className={styles.loading}>Loading…</p>
        </div>
      </DashboardShell>
    );
  }

  if (notFound || !profile) {
    return <Navigate to="/receivers" replace />;
  }

  return (
    <DashboardShell>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <span className={styles.successIcon} aria-hidden>
              <Check size={32} strokeWidth={2.75} />
            </span>
            <h1 className={styles.title}>Receiver Approved Successfully!</h1>
            <p className={styles.subtitle}>
              {profile.name}&apos;s profile has been approved and activated. They
              can now start receiving calls on Callkaro.
            </p>
          </div>

          <div className={styles.summary}>
            <CallerAvatar name={profile.name} size="lg" />
            <div className={styles.summaryMeta}>
              <p className={styles.summaryName}>{profile.name}</p>
              <p className={styles.summaryId}>{profile.code || profile.id}</p>
            </div>
            <div className={styles.badges}>
              <div className={styles.metaChip}>
                <Medal size={14} />
                <span>
                  Level <strong>Level {profile.kyc.level}</strong>
                </span>
              </div>
              <div className={styles.metaChip}>
                <CircleDollarSign size={14} />
                <span>
                  Rate <strong>{rateForLevel(profile.kyc.level)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.activation}>
            <h2 className={styles.sectionTitle}>Activation Details</h2>
            <div className={styles.activationRow}>
              <span className={styles.rowIconSuccess}>
                <Check size={16} strokeWidth={2.5} />
              </span>
              <div className={styles.rowCopy}>
                <p className={styles.rowLabel}>Receiver Status</p>
                <p className={styles.rowValue}>Active and ready for calls</p>
              </div>
              <span className={styles.activeBadge}>Active</span>
            </div>
            <div className={styles.activationRow}>
              <span className={styles.rowIconPink}>
                <CalendarDays size={16} />
              </span>
              <div className={styles.rowCopy}>
                <p className={styles.rowLabel}>Activated At</p>
                <p className={styles.rowValue}>{activatedAt}</p>
              </div>
            </div>
          </div>

          <div className={styles.next}>
            <h2 className={styles.sectionTitle}>What Happens Next?</h2>
            <ol className={styles.nextList}>
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className={styles.nextItem}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <div>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p className={styles.stepBody}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.btnOutline}
              onClick={() => navigate('/verification')}
            >
              Review More Profiles
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
