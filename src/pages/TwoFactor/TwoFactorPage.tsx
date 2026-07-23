import {useEffect, useState, type FormEvent} from 'react';
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {AuthLayout} from '../../components/auth/AuthLayout/AuthLayout';
import {AuthCard} from '../../components/auth/AuthCard/AuthCard';
import {OtpInput} from '../../components/ui/OtpInput/OtpInput';
import {Button} from '../../components/ui/Button/Button';
import {ApiError, getChallengeSession} from '../../api/client';
import {useAuth} from '../../auth/AuthContext';
import styles from './TwoFactorPage.module.css';

const OTP_TTL_SECONDS = 120;

function formatTimer(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function TwoFactorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {admin, loading, completeLogin, resendLoginOtp} = useAuth();

  const locationState = location.state as
    | {email?: string; debugOtp?: string}
    | null;
  const challenge = getChallengeSession();
  const email = locationState?.email || challenge?.email;

  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const [error, setError] = useState('');
  const [hint, setHint] = useState(locationState?.debugOtp || challenge?.debugOtp || '');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft(value => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  if (!loading && admin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!challenge?.challengeToken) {
    return <Navigate to="/login" replace />;
  }

  async function resendCode() {
    setResending(true);
    setError('');
    try {
      const result = await resendLoginOtp();
      setCode('');
      setSecondsLeft(OTP_TTL_SECONDS);
      setHint(result.debugOtp || '');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not resend code. Try again.',
      );
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length < 6) {
      setError('Enter the complete 6-digit code.');
      return;
    }
    if (secondsLeft <= 0) {
      setError('Code expired. Please resend a new code.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await completeLogin(code);
      navigate('/dashboard', {replace: true});
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Verification failed. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Two-Factor Verification"
        subtitle="Enter the 6-digit code sent to your registered device to complete your secure login."
        footer={
          <Link to="/login" className={styles.cancel}>
            Cancel request
          </Link>
        }
      >
        <form className={styles.form} onSubmit={onSubmit}>
          {email ? (
            <p className={styles.emailHint}>
              Code sent for <strong>{email}</strong>
            </p>
          ) : null}

          {hint ? (
            <p className={styles.emailHint}>
              Dev OTP: <strong>{hint}</strong>
            </p>
          ) : null}

          <OtpInput value={code} onChange={setCode} />

          <div className={styles.meta}>
            <p
              className={[
                styles.timer,
                secondsLeft <= 0 ? styles.expired : '',
              ].join(' ')}
            >
              {secondsLeft > 0
                ? `Code expires in ${formatTimer(secondsLeft)}`
                : 'Code expired'}
            </p>
            <button
              type="button"
              className={styles.resend}
              onClick={() => void resendCode()}
              disabled={resending}
            >
              {resending ? 'Sending…' : 'Resend verification code'}
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button type="submit" disabled={code.length < 6 || submitting}>
            {submitting ? 'Verifying…' : 'VERIFY'}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
