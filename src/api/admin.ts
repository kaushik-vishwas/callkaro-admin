import {apiRequest} from './client';

export type Admin = {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
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
