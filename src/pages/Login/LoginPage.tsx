import {useState, type FormEvent} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {ShieldCheck} from 'lucide-react';
import {AuthLayout} from '../../components/auth/AuthLayout/AuthLayout';
import {AuthCard} from '../../components/auth/AuthCard/AuthCard';
import {FormField} from '../../components/ui/FormField/FormField';
import {PasswordField} from '../../components/ui/PasswordField/PasswordField';
import {Checkbox} from '../../components/ui/Checkbox/Checkbox';
import {RecaptchaBox} from '../../components/ui/RecaptchaBox/RecaptchaBox';
import {Button} from '../../components/ui/Button/Button';
import {ApiError} from '../../api/client';
import {useAuth} from '../../auth/AuthContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const {admin, loading, startLogin} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter email and password.');
      return;
    }
    if (!captcha) {
      setError('Please confirm you are not a robot.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const result = await startLogin(email.trim(), password, remember);
      navigate('/two-factor', {
        state: {email: result.email, debugOtp: result.debugOtp},
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Sign in failed. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Callkaro Admin"
        subtitle="Welcome back. Please authenticate to continue."
        footer={
          <div className={styles.secure}>
            <span className={styles.secureBadge}>
              <ShieldCheck size={12} strokeWidth={2.5} />
              SECURE ENVIRONMENT
            </span>
            <p className={styles.secureLinks}>
              <a href="#terms">Terms</a>
              <span>·</span>
              <a href="#security">Security</a>
            </p>
          </div>
        }
      >
        <form className={styles.form} onSubmit={onSubmit}>
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="admin@callkaro.com"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            labelExtra={
              <Link to="/reset-password" className={styles.forgot}>
                Forgot password?
              </Link>
            }
          />

          <Checkbox
            label="Remember device"
            name="remember"
            checked={remember}
            onChange={event => setRemember(event.target.checked)}
          />

          <RecaptchaBox checked={captcha} onChange={setCaptcha} />

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button type="submit" showArrow disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In to Dashboard'}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
