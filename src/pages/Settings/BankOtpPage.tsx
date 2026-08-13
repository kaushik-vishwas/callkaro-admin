import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {KeyRound} from 'lucide-react';
import {ApiError} from '../../api/client';
import {sendAdminBankOtp, verifyAdminBankOtp} from '../../api/admin';
import {
  saveBankChallengeToken,
} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

const OTP_LENGTH = 6;

export function BankOtpPage() {
  const navigate = useNavigate();
  const destination =
    sessionStorage.getItem('callkaro_bank_otp_destination') || 'your account';
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(10 * 60);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => setSeconds(s => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  function setDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function onVerify() {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return;
    setBusy(true);
    setError('');
    try {
      const result = await verifyAdminBankOtp(code);
      saveBankChallengeToken(result.bankChallengeToken);
      navigate('/settings/bank/update');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid OTP.');
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    if (seconds > 0) return;
    setError('');
    try {
      const result = await sendAdminBankOtp();
      if (result.debugOtp) setDebugOtp(result.debugOtp);
      setSeconds((result.otpExpiresInMinutes || 10) * 60);
      setDigits(Array(OTP_LENGTH).fill(''));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend OTP.');
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <SettingsLayout
      title="Enter Verification Code"
      subtitle={`A 6-digit verification code has been sent to ${destination}. It will be valid for 10 minutes.`}
    >
      <section className={styles.centerCard}>
        <div className={styles.iconWrap}>
          <KeyRound size={26} />
        </div>
        <div className={styles.otpRow}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={el => {
                inputsRef.current[index] = el;
              }}
              className={styles.otpInput}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`Digit ${index + 1}`}
              onChange={event => setDigit(index, event.target.value)}
              onKeyDown={event => onKeyDown(index, event.key)}
            />
          ))}
        </div>

        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        {debugOtp ? <p className={styles.hint}>Dev OTP: {debugOtp}</p> : null}

        <div className={styles.helperRow}>
          <p style={{margin: 0}}>
            {seconds > 0
              ? `Resend code in ${mm}:${ss}`
              : 'You can resend the code now.'}
          </p>
          <button
            type="button"
            className={styles.linkBtn}
            disabled={seconds > 0}
            onClick={() => void onResend()}
          >
            Resend OTP
          </button>
          <Link to="/settings/profile" className={styles.linkBtn}>
            Update mobile number in Profile
          </Link>
        </div>

        <div className={styles.centerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={digits.join('').length !== OTP_LENGTH || busy}
            onClick={() => void onVerify()}
          >
            {busy ? 'Verifying…' : 'Verify OTP'}
          </button>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Cancel
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
