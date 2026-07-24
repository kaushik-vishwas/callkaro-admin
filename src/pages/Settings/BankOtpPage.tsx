import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {KeyRound} from 'lucide-react';
import {SETTINGS_PROFILE} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

const OTP_LENGTH = 6;

export function BankOtpPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(99);
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

  function onVerify() {
    const code = digits.join('');
    if (code.length === OTP_LENGTH) {
      navigate('/settings/bank/update');
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <SettingsLayout
      title="Enter Verification Code"
      subtitle={`A 6-digit verification code has been sent to your registered mobile number ${SETTINGS_PROFILE.mobileMasked}. It will be valid for 10 minutes.`}
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

        <div className={styles.helperRow}>
          <p style={{margin: 0}}>
            {seconds > 0 ? `Resend code in ${mm}:${ss}` : 'You can resend the code now.'}
          </p>
          <button
            type="button"
            className={styles.linkBtn}
            disabled={seconds > 0}
            onClick={() => {
              setSeconds(99);
              setDigits(Array(OTP_LENGTH).fill(''));
            }}
          >
            Resend OTP
          </button>
          <button type="button" className={styles.linkBtn}>
            Experiencing issues? Change Mobile Number
          </button>
        </div>

        <div className={styles.centerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={digits.join('').length !== OTP_LENGTH}
            onClick={onVerify}
          >
            Verify OTP
          </button>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Cancel
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
