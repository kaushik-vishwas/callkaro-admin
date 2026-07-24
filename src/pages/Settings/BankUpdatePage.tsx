import {useState, type FormEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
  BANK_OPTIONS,
  COUNTRY_OPTIONS,
  CURRENT_BANK_ACCOUNT,
  loadBankDraft,
  saveBankDraft,
  type BankAccount,
} from '../../data/settings';
import {SettingsLayout} from './SettingsLayout';
import styles from './settingsShared.module.css';

export function BankUpdatePage() {
  const navigate = useNavigate();
  const initial = loadBankDraft();
  const seeded =
    initial.accountHolder || initial.iban
      ? initial
      : {
          ...CURRENT_BANK_ACCOUNT,
          accountHolder: CURRENT_BANK_ACCOUNT.accountHolder,
          iban: '',
          ibanMasked: '',
          verified: false,
        };

  const [form, setForm] = useState<BankAccount>(seeded);

  function update<K extends keyof BankAccount>(key: K, value: BankAccount[K]) {
    setForm(prev => ({...prev, [key]: value}));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    saveBankDraft({
      ...form,
      ibanMasked:
        form.iban.length > 8
          ? `${form.iban.slice(0, 2)}${'*'.repeat(Math.max(0, form.iban.length - 6))}${form.iban.slice(-4)}`
          : form.iban,
    });
    navigate('/settings/bank/review');
  }

  return (
    <SettingsLayout
      title="Update Bank Account"
      subtitle="Input your new financial gateway credentials accurately. Ensure the SWIFT code matches your branch location."
    >
      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="holder">Account Holder Name</label>
            <input
              id="holder"
              required
              value={form.accountHolder}
              onChange={e => update('accountHolder', e.target.value)}
              placeholder="Full legal name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="bank">Bank Name</label>
            <select
              id="bank"
              value={form.bankName}
              onChange={e => update('bankName', e.target.value)}
            >
              {BANK_OPTIONS.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="iban">IBAN / Account Number</label>
              <input
                id="iban"
                required
                value={form.iban}
                onChange={e => update('iban', e.target.value.toUpperCase())}
                placeholder="Account number or IBAN"
              />
              <p className={styles.hint}>
                Enter a valid account number for the selected bank.
              </p>
            </div>
            <div className={styles.field}>
              <label htmlFor="swift">SWIFT / BIC Code</label>
              <input
                id="swift"
                required
                value={form.swift}
                onChange={e => update('swift', e.target.value.toUpperCase())}
                placeholder="e.g. HDFCINBB"
              />
              <p className={styles.hint}>8–11 characters</p>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="branch">Branch Name</label>
            <input
              id="branch"
              required
              value={form.branchName}
              onChange={e => update('branchName', e.target.value)}
              placeholder="Branch name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={form.country}
              onChange={e => update('country', e.target.value)}
            >
              {COUNTRY_OPTIONS.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Account Type</label>
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="accountType"
                  checked={form.accountType === 'savings'}
                  onChange={() => update('accountType', 'savings')}
                />
                Savings
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="accountType"
                  checked={form.accountType === 'current'}
                  onChange={() => update('accountType', 'current')}
                />
                Current
              </label>
            </div>
          </div>
        </div>

        <div className={styles.actions} style={{marginTop: 18}}>
          <button type="submit" className={styles.primaryBtn}>
            Review Details
          </button>
          <Link to="/settings/bank" className={styles.secondaryBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </SettingsLayout>
  );
}
