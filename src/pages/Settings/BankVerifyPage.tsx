import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Phone, ShieldCheck} from 'lucide-react';
import {useAuth} from '../../auth/AuthContext';
import {ApiError} from '../../api/client';
import {sendAdminBankOtp} from '../../api/admin';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankVerifyPage() {
  const navigate = useNavigate();
  const {admin} = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');

  async function onSendOtp() {
    setBusy(true);
    setError('');
    try {
      const result = await sendAdminBankOtp();
      if (result.debugOtp) setDebugOtp(result.debugOtp);
      sessionStorage.setItem(
        'callkaro_bank_otp_destination',
        result.destination,
      );
      navigate('/settings/bank/otp');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SettingsLayout
      title="Security Verification"
      subtitle="Confirm your identity before changing payout credentials."
    >
      <section className={styles.centerCard}>
        <div className={styles.iconWrap}>
          <ShieldCheck size={28} />
        </div>
        <h2 className={styles.centerTitle}>Verify Your Identity</h2>
        <p className={styles.centerText}>
          For your security, please verify your identity before updating your
          bank account details. We will send a secure OTP to your registered
          contact.
        </p>

        <div className={styles.contactCard}>
          <span className={styles.contactIcon}>
            <Phone size={18} />
          </span>
          <div>
            <p className={styles.contactLabel}>
              {admin?.phone ? 'Mobile Number' : 'Email'}
            </p>
            <p className={styles.contactValue}>
              {admin?.phoneMasked && admin.phoneMasked !== 'Not set'
                ? admin.phoneMasked
                : admin?.email || '—'}
            </p>
          </div>
        </div>

        {error ? (
          <p style={{color: '#b91c1c', fontWeight: 600}}>{error}</p>
        ) : null}
        {debugOtp ? (
          <p className={styles.hint}>Dev OTP: {debugOtp}</p>
        ) : null}

        <div className={styles.centerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={busy}
            onClick={() => void onSendOtp()}
          >
            {busy ? 'Sending…' : 'Send OTP'}
          </button>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Cancel
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
