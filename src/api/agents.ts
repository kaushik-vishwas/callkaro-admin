import {apiRequest} from './client';

export type AgentStatus = 'active' | 'inactive';

export type AdminAgentListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joinedAt: string;
  lastActive: string;
  receivers: number;
  revenue: number;
  commission: number;
  pending: number;
  rank: number;
  status: AgentStatus;
  highRevenue: boolean;
  topCommission: boolean;
  avatarUrl?: string;
};

export type AdminAgentStats = {
  totalAgents: number;
  activeAgents: number;
  topPerforming: number;
  totalCommission: number;
  totalRevenue: number;
  totalCommissionLabel: string;
  revenueViaAgentsLabel: string;
};

export type AdminAgentProfile = AdminAgentListItem & {
  availableBalance: number;
  team: {
    totalReceivers: number;
    activeReceivers: number;
    onlineNow: number;
    blocked: number;
    inactive: number;
  };
  commissionDashboard: {
    totalEarned: number;
    pending: number;
    available: number;
    lifetimeEarnings: number;
    totalRevenueGenerated: number;
  };
  revenueAnalytics: {
    totalRevenue: number;
    avgRevPerReceiver: number;
    monthlyRevenue: number;
    growthPct: number;
    revenueRank: number;
  };
  earningsTrend: Array<{month: string; value: number}>;
  receiverPerformance: Array<{
    id: string;
    name: string;
    calls: number;
    coinsEarned: number;
    revenue: number;
    commission: number;
    status: 'active' | 'inactive' | 'blocked';
  }>;
  timeline: Array<{
    id: string;
    title: string;
    detail: string;
    tone: 'pink' | 'amber' | 'green' | 'purple';
  }>;
};

export type AgentsListResponse = {
  agents: AdminAgentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export async function fetchAgentStats() {
  return apiRequest<{stats: AdminAgentStats}>('/admin/agents/stats');
}

export async function fetchAgents(params: {
  q?: string;
  tab?: string;
  status?: string;
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
  return apiRequest<AgentsListResponse>(
    `/admin/agents${qs ? `?${qs}` : ''}`,
  );
}

export async function createAgent(payload: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  agentCode?: string;
}) {
  return apiRequest<{
    agent: AdminAgentListItem;
    temporaryPassword: string;
  }>('/admin/agents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchAgent(id: string) {
  return apiRequest<{agent: AdminAgentProfile}>(`/admin/agents/${id}`);
}

export async function updateAgent(
  id: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    avatarUrl?: string;
  },
) {
  return apiRequest<{agent: AdminAgentProfile}>(`/admin/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function resetAgentPassword(id: string, newPassword?: string) {
  return apiRequest<{temporaryPassword: string}>(
    `/admin/agents/${id}/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify({newPassword}),
    },
  );
}
