import {Link, useNavigate} from 'react-router-dom';
import {Phone, ShieldCheck} from 'lucide-react';
import {SETTINGS_PROFILE} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankVerifyPage() {
  const navigate = useNavigate();

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
          phone.
        </p>

        <div className={styles.contactCard}>
          <span className={styles.contactIcon}>
            <Phone size={18} />
          </span>
          <div>
            <p className={styles.contactLabel}>Mobile Number</p>
            <p className={styles.contactValue}>
              {SETTINGS_PROFILE.mobileMasked}
            </p>
          </div>
        </div>

        <div className={styles.centerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => navigate('/settings/bank/otp')}
          >
            Send OTP
          </button>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Cancel
          </Link>
        </div>
      </section>
    </SettingsLayout>
  );
}
