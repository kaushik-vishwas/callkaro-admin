import {useMemo, useState, type FormEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowLeft, Save, X} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {FormSection} from '../../components/franchise/FormSection/FormSection';
import {Field} from '../../components/franchise/Field/Field';
import {FileUploadBox} from '../../components/franchise/FileUploadBox/FileUploadBox';
import {nextFranchiseCode} from '../../data/franchises';
import styles from './CreateFranchisePage.module.css';

export function CreateFranchisePage() {
  const navigate = useNavigate();
  const franchiseCode = useMemo(() => nextFranchiseCode(), []);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    commission: '10',
    pricing: '1000',
    accountNumber: '',
    ifsc: '',
    holderName: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm(current => ({...current, [key]: value}));
  }

  function save(asDraft = false) {
    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim()) {
      setMessage('Please fill franchise name, mobile, and email.');
      return;
    }
    setMessage(
      asDraft
        ? 'Draft saved locally (API not wired yet).'
        : 'Franchise created locally (API not wired yet).',
    );
    window.setTimeout(() => navigate('/franchise'), 900);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save(false);
  }

  return (
    <DashboardShell>
      <form className={styles.page} onSubmit={onSubmit}>
        <header className={styles.header}>
          <div>
            <Link to="/franchise" className={styles.back}>
              <ArrowLeft size={15} strokeWidth={2.5} />
              Back
            </Link>
            <h1 className={styles.title}>Create New Franchise</h1>
            <p className={styles.subtitle}>
              Complete franchise onboarding workflow
            </p>
          </div>
        </header>

        {message ? <p className={styles.message}>{message}</p> : null}

        <FormSection title="Basic Information">
          <div className={styles.grid3}>
            <Field
              label="Franchise Name"
              placeholder="Enter franchise name"
              value={form.name}
              onChange={event => update('name', event.target.value)}
            />
            <Field
              label="Mobile Number"
              placeholder="9876543210"
              prefix="+91"
              value={form.mobile}
              onChange={event => update('mobile', event.target.value)}
            />
            <Field
              label="Email Address"
              type="email"
              placeholder="owner@example.com"
              value={form.email}
              onChange={event => update('email', event.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="Franchise Configuration">
          <div className={styles.grid3}>
            <Field
              label="Franchise Code"
              value={franchiseCode}
              readOnly
              readOnlyBox
            />
            <Field
              label="Default Commission %"
              type="number"
              value={form.commission}
              onChange={event => update('commission', event.target.value)}
            />
            <Field
              label="Default Pricing (Coins/Min)"
              type="number"
              value={form.pricing}
              onChange={event => update('pricing', event.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="Bank Details">
          <div className={styles.grid3}>
            <Field
              label="Account Number"
              placeholder="Enter account number"
              value={form.accountNumber}
              onChange={event => update('accountNumber', event.target.value)}
            />
            <Field
              label="IFSC Code"
              placeholder="HDFC0001234"
              value={form.ifsc}
              onChange={event => update('ifsc', event.target.value)}
            />
            <Field
              label="Account Holder Name"
              placeholder="Enter holder name"
              value={form.holderName}
              onChange={event => update('holderName', event.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="KYC Documents">
          <div className={styles.kycLayout}>
            <div>
              <p className={styles.kycGroupTitle}>Personal KYC</p>
              <div className={styles.uploadGrid}>
                <FileUploadBox label="PAN Card" />
                <FileUploadBox label="Aadhaar Card" />
                <FileUploadBox label="Passport Photo" />
              </div>
            </div>
            <div>
              <p className={styles.kycGroupTitle}>Bank Verification</p>
              <div className={styles.bankUploadRow}>
                <FileUploadBox label="Cancelled Cheque" />
                <p className={styles.bankHint}>
                  Bank details will be verified after document submission
                </p>
              </div>
            </div>
          </div>
        </FormSection>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/franchise')}
          >
            <X size={15} />
            Cancel
          </button>
          <button
            type="button"
            className={styles.draftBtn}
            onClick={() => save(true)}
          >
            <Save size={15} />
            Save Draft
          </button>
          <button type="submit" className={styles.submitBtn}>
            Create Franchise
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
