import {apiRequest} from './client';

export type TransactionType = 'Recharge' | 'VIP';
export type TransactionStatus = 'successful' | 'failed' | 'pending';

export type TransactionItem = {
  id: string;
  code: string;
  userId: string;
  userName: string;
  userEmail?: string;
  callerId?: string;
  type: TransactionType;
  purpose?: 'recharge' | 'vip';
  planId?: string | null;
  amount: number;
  coins: number;
  dateTime: string;
  dateTimeLabel: string;
  status: TransactionStatus;
  orderStatus?: string;
  ipAddress: string;
  paymentMethod: string;
  gatewayId: string;
  category: string;
  currency?: string;
};

export type TransactionStats = {
  totalTransactions: number;
  vipPurchases: number;
  totalRevenue: number;
  totalRevenueLabel: string;
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

export async function fetchTransactionStats() {
  return apiRequest<{stats: TransactionStats}>('/admin/transactions/stats');
}

export async function fetchTransactions(
  params: {
    q?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {},
) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return apiRequest<{
    transactions: TransactionItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/transactions${qs ? `?${qs}` : ''}`);
}

export async function fetchTransaction(id: string) {
  return apiRequest<{transaction: TransactionItem}>(
    `/admin/transactions/${encodeURIComponent(id)}`,
  );
}
