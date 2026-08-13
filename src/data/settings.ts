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
  reference?: string;
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

export const BANK_OPTIONS = [
  'HDFC Bank Limited',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Yes Bank',
];

export const COUNTRY_OPTIONS = ['India', 'Bahrain', 'UAE', 'Saudi Arabia'];

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
const BANK_CHALLENGE_KEY = 'callkaro_bank_challenge';
const BANK_SUCCESS_KEY = 'callkaro_bank_success';

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

export function saveBankChallengeToken(token: string) {
  sessionStorage.setItem(BANK_CHALLENGE_KEY, token);
}

export function loadBankChallengeToken(): string | null {
  return sessionStorage.getItem(BANK_CHALLENGE_KEY);
}

export function clearBankChallengeToken() {
  sessionStorage.removeItem(BANK_CHALLENGE_KEY);
}

export function saveBankSuccessMeta(meta: {
  reference: string;
  updatedOnLabel: string;
  updatedBy: string;
}) {
  sessionStorage.setItem(BANK_SUCCESS_KEY, JSON.stringify(meta));
}

export function loadBankSuccessMeta(): {
  reference: string;
  updatedOnLabel: string;
  updatedBy: string;
} | null {
  try {
    const raw = sessionStorage.getItem(BANK_SUCCESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      reference: string;
      updatedOnLabel: string;
      updatedBy: string;
    };
  } catch {
    return null;
  }
}

export function clearBankSuccessMeta() {
  sessionStorage.removeItem(BANK_SUCCESS_KEY);
}
