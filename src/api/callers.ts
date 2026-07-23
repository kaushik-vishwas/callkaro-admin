import {apiRequest} from './client';

export type CallerStatus = 'active' | 'inactive' | 'blocked' | 'suspended';

export type AdminCallerListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  registeredAt: string;
  coins: number;
  totalRecharge: number;
  calls: number;
  vip: boolean;
  status: CallerStatus;
  lastActive: string;
  avatarUrl?: string;
};

export type AdminCallerStats = {
  totalUsers: number;
  activeNow: number;
  totalCallers: number;
  activeCallers: number;
  vipCallers: number;
  blockedCallers: number;
  totalRevenue: number;
  avgRevenue: number;
  totalRevenueLabel: string;
  avgRevenueLabel: string;
};

export type AdminCallerProfile = AdminCallerListItem & {
  wallet: {
    currentBalance: number;
    purchased: number;
    consumed: number;
    bonus: number;
    totalRechargeAmount: number;
  };
  analytics: {
    totalCalls: number;
    completed: number;
    missed: number;
    cancelled: number;
    avgDuration: string;
    totalTalkTime: string;
  };
  weeklyActivity: Array<{day: string; calls: number}>;
  recentCalls: Array<{
    id: string;
    receiver: string;
    duration: string;
    coins: number;
    status: 'completed' | 'missed' | 'cancelled';
  }>;
  timeline: Array<{
    id: string;
    title: string;
    detail: string;
    time: string;
    tone: 'pink' | 'amber' | 'green' | 'purple';
  }>;
  ticketsRaised: number;
  reportsSubmitted: number;
};

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export async function fetchCallerStats() {
  return apiRequest<{stats: AdminCallerStats}>('/admin/callers/stats');
}

export async function fetchCallers(params: {
  q?: string;
  tab?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return apiRequest<{
    callers: AdminCallerListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/callers${qs ? `?${qs}` : ''}`);
}

export async function fetchCaller(id: string) {
  return apiRequest<{caller: AdminCallerProfile}>(`/admin/callers/${id}`);
}

export async function resetCallerPassword(id: string, newPassword?: string) {
  return apiRequest<{temporaryPassword: string}>(
    `/admin/callers/${id}/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify({newPassword}),
    },
  );
}
