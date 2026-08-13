import {apiRequest} from './client';
import type {
  WithdrawalItem,
  WithdrawalSort,
  WithdrawalStats,
  WithdrawalStatus,
} from '../data/withdrawals';

export type {WithdrawalItem, WithdrawalSort, WithdrawalStats, WithdrawalStatus};

export async function fetchWithdrawalStats() {
  return apiRequest<{stats: WithdrawalStats}>('/admin/withdrawals/stats');
}

export async function fetchWithdrawals(
  params: {
    q?: string;
    sort?: WithdrawalSort;
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    receiverId?: string;
    agentId?: string;
    status?: WithdrawalStatus | 'all' | string;
  } = {},
) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'all')
      return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return apiRequest<{
    withdrawals: WithdrawalItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/withdrawals${qs ? `?${qs}` : ''}`);
}

export async function fetchWithdrawal(id: string) {
  return apiRequest<{withdrawal: WithdrawalItem}>(
    `/admin/withdrawals/${encodeURIComponent(id)}`,
  );
}

export async function updateWithdrawal(
  id: string,
  action: 'approve' | 'reject' | 'pay',
  payload: {reason?: string; utr?: string} = {},
) {
  return apiRequest<{withdrawal: WithdrawalItem}>(
    `/admin/withdrawals/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({action, ...payload}),
    },
  );
}
