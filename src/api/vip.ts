import {apiRequest} from './client';

export type VipPeriod = 'weekly' | 'monthly' | 'yearly';
export type VipPlanStatus = 'active' | 'inactive';
export type VipUserStatus = 'active' | 'blocked' | 'suspended';

export type VipPlan = {
  id: string;
  name: string;
  durationDays: number;
  durationLabel: string;
  price: number;
  originalPrice?: number;
  bonusCoins?: number;
  perDayLabel?: string;
  saveBadge?: string | null;
  status: VipPlanStatus;
  popular?: boolean;
  icon: 'bolt' | 'calendar';
};

export type VipPlanStats = {
  activeVips: number;
  monthlyRevenue: number;
  monthlyRevenueLabel: string;
  conversionRate: string;
  totalCallers?: number;
};

export type VipTopUser = {
  id: string;
  name: string;
  userId: string;
  amountSpent: number;
  totalCalls: number;
  status: VipUserStatus | string;
};

export type VipAnalytics = {
  revenue: number;
  revenueLabel: string;
  activeVipUsers: number;
  chart: Array<{label: string; value: number}>;
  topUsers: VipTopUser[];
};

export type VipDirectoryStats = {
  totalCallers: number;
  activeCallers: number;
  vipCallers: number;
  totalRevenue?: number;
  totalRevenueLabel: string;
  avgRevenueLabel: string;
};

export type VipUser = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  age: number;
  location: string;
  regDate: string;
  coins: number;
  totalRecharge: number;
  calls: number;
  vipPlan: string;
  vipPlanId?: string | null;
  vipExpiresAt?: string | null;
  status: VipUserStatus;
  lastActive: string;
  joinDate: string;
  balance: number;
  lastRecharge: string;
  lastWithdrawal: string;
  callSummary: {
    totalCalls: number;
    totalMins: number;
    coinsSpent: number;
    level: string;
  };
  activityStats: {
    totalCalls: number;
    vipCalls: number;
    coinsSpent: number;
    avgDuration: string;
  };
  recentCalls: Array<{
    id: string;
    name: string;
    callType: 'Video' | 'Audio' | string;
    duration: string;
    coins: number;
    dateTime: string;
  }>;
  transactions: Array<{
    id: string;
    date: string;
    type: string;
    amount: number;
    status: 'success' | 'failed' | 'pending' | string;
  }>;
};

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export async function fetchVipPlans() {
  return apiRequest<{plans: VipPlan[]; stats: VipPlanStats}>('/admin/vip/plans');
}

export async function fetchVipAnalytics(period: VipPeriod = 'monthly') {
  return apiRequest<{analytics: VipAnalytics}>(
    `/admin/vip/analytics?period=${encodeURIComponent(period)}`,
  );
}

export async function fetchVipUsers(params: {
  q?: string;
  tab?: string;
  page?: number;
  limit?: number;
} = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return apiRequest<{
    users: VipUser[];
    stats: VipDirectoryStats;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/vip/users${qs ? `?${qs}` : ''}`);
}

export async function fetchVipUser(id: string) {
  return apiRequest<{user: VipUser}>(`/admin/vip/users/${encodeURIComponent(id)}`);
}
