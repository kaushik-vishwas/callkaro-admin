import {apiRequest} from './client';

export type AdminBankAccount = {
  accountHolder: string;
  bankName: string;
  iban: string;
  ibanMasked: string;
  swift: string;
  branchName: string;
  country: string;
  accountType: 'savings' | 'current';
  verified: boolean;
  updatedAt?: string | null;
  updatedAtLabel?: string;
  reference?: string;
};

export type Admin = {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  role?: string;
  status?: string;
  phoneMasked?: string;
  twoFactorEnabled?: boolean;
  passwordChangedAt?: string | null;
  passwordChangedAtLabel?: string;
  lastLoginAt?: string | null;
  lastLoginAtLabel?: string;
  activeSessions?: number;
  activeSessionsLabel?: string;
  bank?: AdminBankAccount;
};

export type AdminWalletSnapshot = {
  availableBalance: number;
  availableBalanceLabel: string;
  pendingSettlements: number;
  pendingSettlementsLabel: string;
  lastPayoutAmount: number;
  lastPayoutAt?: string | null;
  lastPayoutLabel: string;
  totalRevenue?: number;
  totalPaidOut?: number;
};

export type AdminHelpSupport = {
  email: string;
  phone: string;
  hours: string;
};

export type LoginChallenge = {
  requires2fa: boolean;
  challengeToken: string;
  email: string;
  otpExpiresInMinutes: number;
  debugOtp?: string;
};

export async function loginAdmin(email: string, password: string) {
  return apiRequest<LoginChallenge>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  });
}

export async function verifyAdmin2fa(challengeToken: string, otp: string) {
  return apiRequest<{token: string; admin: Admin}>('/admin/verify-2fa', {
    method: 'POST',
    body: JSON.stringify({challengeToken, otp}),
  });
}

export async function resendAdmin2fa(challengeToken: string) {
  return apiRequest<{otpExpiresInMinutes: number; debugOtp?: string}>(
    '/admin/resend-2fa',
    {
      method: 'POST',
      body: JSON.stringify({challengeToken}),
    },
  );
}

export async function forgotAdminPassword(email: string) {
  return apiRequest<{
    email?: string;
    otpExpiresInMinutes?: number;
    debugOtp?: string;
  }>('/admin/forgot-password', {
    method: 'POST',
    body: JSON.stringify({email}),
  });
}

export async function resetAdminPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return apiRequest<Record<string, never>>('/admin/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminMe() {
  return apiRequest<{admin: Admin}>('/admin/me');
}

export async function updateAdminProfile(payload: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
}) {
  return apiRequest<{admin: Admin}>('/admin/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
) {
  return apiRequest<{admin: Admin}>('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({currentPassword, newPassword}),
  });
}

export async function fetchAdminWallet() {
  return apiRequest<{wallet: AdminWalletSnapshot}>('/admin/settings/wallet');
}

export async function fetchAdminHelp() {
  return apiRequest<{help: AdminHelpSupport}>('/admin/settings/help');
}

export function updateAdminHelp(input: AdminHelpSupport) {
  return apiRequest<{help: AdminHelpSupport}>('/admin/settings/help', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function fetchAdminBank() {
  return apiRequest<{bank: AdminBankAccount; admin: Admin}>(
    '/admin/settings/bank',
  );
}

export async function sendAdminBankOtp() {
  return apiRequest<{
    destination: string;
    channel: string;
    phoneMasked: string;
    otpExpiresInMinutes: number;
    debugOtp?: string;
  }>('/admin/settings/bank/send-otp', {method: 'POST', body: '{}'});
}

export async function verifyAdminBankOtp(otp: string) {
  return apiRequest<{bankChallengeToken: string; expiresInMinutes: number}>(
    '/admin/settings/bank/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify({otp}),
    },
  );
}

export async function confirmAdminBank(
  bankChallengeToken: string,
  bank: {
    accountHolder: string;
    bankName: string;
    iban: string;
    swift: string;
    branchName: string;
    country: string;
    accountType: 'savings' | 'current';
  },
) {
  return apiRequest<{
    bank: AdminBankAccount;
    admin: Admin;
    reference: string;
    updatedOnLabel: string;
  }>('/admin/settings/bank/confirm', {
    method: 'POST',
    body: JSON.stringify({bankChallengeToken, ...bank}),
  });
}
