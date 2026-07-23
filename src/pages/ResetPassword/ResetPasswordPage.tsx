import {useMemo, useState, type FormEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import {AuthLayout} from '../../components/auth/AuthLayout/AuthLayout';
import {AuthCard} from '../../components/auth/AuthCard/AuthCard';
import {FormField} from '../../components/ui/FormField/FormField';
import {PasswordField} from '../../components/ui/PasswordField/PasswordField';
import {PasswordStrengthMeter} from '../../components/ui/PasswordStrength/PasswordStrength';
import {OtpInput} from '../../components/ui/OtpInput/OtpInput';
import {Button} from '../../components/ui/Button/Button';
import {
  forgotAdminPassword,
  resetAdminPassword,
} from '../../api/admin';
import {ApiError} from '../../api/client';
import {
  getPasswordChecks,
  passwordsMatch,
} from '../../utils/passwordStrength';
import styles from './ResetPasswordPage.module.css';

type Step = 'email' | 'otp' | 'password';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allChecksPass = useMemo(() => {
    const checks = getPasswordChecks(password);
    return Object.values(checks).every(Boolean);
  }, [password]);

  async function onEmailSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError('Enter your admin email.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await forgotAdminPassword(email.trim());
      setHint(result.debugOtp || '');
      setStep('otp');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start reset. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function onOtpSubmit(event: FormEvent) {
    event.preventDefault();
    if (otp.length < 6) {
      setError('Enter the complete 6-digit code.');
      return;
    }
    setError('');
    setStep('password');
  }

  async function onPasswordSubmit(event: FormEvent) {
    event.preventDefault();
    if (!allChecksPass) {
      setError('Password does not meet all security requirements.');
      return;
    }
    if (!passwordsMatch(password, confirm)) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await resetAdminPassword({
        email: email.trim(),
        otp,
        newPassword: password,
      });
      navigate('/login', {replace: true});
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not reset password. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const titles: Record<Step, {title: string; subtitle: string}> = {
    email: {
      title: 'Secure Reset',
      subtitle:
        'Enter your admin email and we will send a 6-digit verification code.',
    },
    otp: {
      title: 'Verify Reset Code',
      subtitle:
        'Enter the 6-digit code sent to your email to continue resetting your password.',
    },
    password: {
      title: 'Secure Reset',
      subtitle:
        'Please provide a strong, unique password to ensure your account security remains uncompromising.',
    },
  };

  return (
    <AuthLayout>
      <AuthCard
        title={titles[step].title}
        subtitle={titles[step].subtitle}
        footer={
          <Link to="/login" className={styles.back}>
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to secure login
          </Link>
        }
      >
        {step === 'email' ? (
          <form className={styles.form} onSubmit={onEmailSubmit}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@callkaro.com"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
            {error ? <p className={styles.error}>{error}</p> : null}
            <Button type="submit" showArrow disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset code'}
            </Button>
          </form>
        ) : null}

        {step === 'otp' ? (
          <form className={styles.form} onSubmit={onOtpSubmit}>
            <p className={styles.hint}>
              Code sent for <strong>{email.trim()}</strong>
            </p>
            {hint ? (
              <p className={styles.hint}>
                Dev OTP: <strong>{hint}</strong>
              </p>
            ) : null}
            <OtpInput value={otp} onChange={setOtp} />
            {error ? <p className={styles.error}>{error}</p> : null}
            <Button type="submit" disabled={otp.length < 6}>
              Continue
            </Button>
          </form>
        ) : null}

        {step === 'password' ? (
          <form className={styles.form} onSubmit={onPasswordSubmit}>
            <PasswordField
              label="New password"
              name="newPassword"
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            <PasswordStrengthMeter password={password} />

            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirm}
              onChange={event => setConfirm(event.target.value)}
              error={
                confirm && !passwordsMatch(password, confirm)
                  ? 'Passwords do not match'
                  : undefined
              }
            />

            {error ? <p className={styles.error}>{error}</p> : null}

            <Button
              type="submit"
              showArrow
              disabled={!password || !confirm || submitting}
            >
              {submitting ? 'Updating…' : 'Update Credentials'}
            </Button>
          </form>
        ) : null}
      </AuthCard>
    </AuthLayout>
  );
}
