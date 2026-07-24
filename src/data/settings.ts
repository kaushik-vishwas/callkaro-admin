export type BankAccount = {
  accountHolder: string;
  bankName: string;
  iban: string;
  ibanMasked: string;
  swift: string;
  branchName: string;
  country: string;
  accountType: 'savings' | 'current';
  verified: boolean;
};

export type SettingsSectionId =
  | 'overview'
  | 'wallet'
  | 'profile'
  | 'security'
  | 'bank'
  | 'help';

export const SETTINGS_SECTIONS: Array<{
  id: SettingsSectionId;
  label: string;
  to: string;
}> = [
  {id: 'overview', label: 'Overview', to: '/settings'},
  {id: 'wallet', label: 'My Wallet', to: '/settings/wallet'},
  {id: 'profile', label: 'Profile Settings', to: '/settings/profile'},
  {id: 'security', label: 'Security & Login', to: '/settings/security'},
  {id: 'bank', label: 'Bank Accounts', to: '/settings/bank'},
  {id: 'help', label: 'Help & Support', to: '/settings/help'},
];

export const CURRENT_BANK_ACCOUNT: BankAccount = {
  accountHolder: 'Butch Jones',
  bankName: 'HDFC Bank Limited',
  iban: 'IN**************8831',
  ibanMasked: 'IN**************8831',
  swift: 'HDFCINBB',
  branchName: 'Bandra West Branch',
  country: 'India',
  accountType: 'savings',
  verified: true,
};

export const BANK_OPTIONS = [
  'HDFC Bank Limited',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Yes Bank',
];

export const COUNTRY_OPTIONS = ['India', 'Bahrain', 'UAE', 'Saudi Arabia'];

export const SETTINGS_PROFILE = {
  name: 'Butch Jones',
  role: 'Super Admin',
  mobileMasked: '+91 *******452',
  email: 'admin@callkaro.com',
  status: 'Verified Client',
};

export const EMPTY_BANK_DRAFT: BankAccount = {
  accountHolder: '',
  bankName: BANK_OPTIONS[0],
  iban: '',
  ibanMasked: '',
  swift: '',
  branchName: '',
  country: 'India',
  accountType: 'savings',
  verified: false,
};

const DRAFT_KEY = 'callkaro_bank_draft';

export function loadBankDraft(): BankAccount {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return {...EMPTY_BANK_DRAFT};
    return {...EMPTY_BANK_DRAFT, ...JSON.parse(raw)};
  } catch {
    return {...EMPTY_BANK_DRAFT};
  }
}

export function saveBankDraft(draft: BankAccount) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearBankDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}
