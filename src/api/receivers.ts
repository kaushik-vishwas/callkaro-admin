import {apiRequest} from './client';

export type ReceiverStatus = 'active' | 'inactive' | 'blocked';
/** Raw backend Receiver.status. */
export type ReceiverStatusKey =
  | 'draft'
  | 'pending_onboarding'
  | 'pending_review'
  | 'active'
  | 'inactive'
  | 'rejected';
/** Admin display stage computed by the backend. */
export type ReceiverStage =
  | 'draft'
  | 'pending'
  | 'active'
  | 'suspended'
  | 'blocked'
  | 'rejected';
export type ReceiverPresence = 'online' | 'offline';

export type AdminReceiverListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  gender: string;
  languages: string[];
  joinedAt: string;
  agentName: string;
  agentCode: string;
  agentId?: string;
  agentCommission: number;
  calls: number;
  /** Total coins earned (calls + gifts). */
  coinsEarned: number;
  /** Part of coinsEarned that came from gifts. */
  giftCoinsEarned?: number;
  /** Part of coinsEarned that came from calls. */
  callCoinsEarned?: number;
  /** Total completed call time, e.g. "4 min 5 sec". */
  talkTimeLabel?: string;
  /** Part of coinsEarned that came from chat messages. */
  chatCoinsEarned?: number;
  revenue: number;
  earnings: number;
  rank: number;
  status: ReceiverStatus;
  statusKey?: ReceiverStatusKey;
  stage?: ReceiverStage;
  presence: ReceiverPresence;
  topPerformer: boolean;
  idealProfile?: boolean;
  engagementMinutesToday?: number;
  level?: number;
};

export type AdminReceiverStats = {
  totalReceivers: number;
  onlineNow: number;
  offline: number;
  suspended: number;
  blocked: number;
  totalRevenue: number;
  totalEarnings: number;
  earningsPaid: number;
  pendingWd: number;
  totalRevenueLabel: string;
  earningsPaidLabel: string;
  pendingWdLabel: string;
};

export type AdminReceiverProfile = AdminReceiverListItem & {
  age?: number;
  level?: number;
  bio?: string;
  availableBalance: number;
  withdrawnAmount: number;
  performance: {
    callsThisMonth: number;
    completed: number;
    missed: number;
    onlineHours: number;
  };
  revenueTrend: Array<{month: string; value: number}>;
  withdrawals: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    settlement: string;
  }>;
  compliance: {
    warnings: number;
    violations: number;
    aiFlags: number;
    contactReports: number;
  };
  kyc: {
    receiverId: string;
    submitted: string;
    reviewStatus: 'pending' | 'approved' | 'rejected' | 'incomplete';
    age: number;
    level: number;
    bio: string;
    photos: string[];
    bank: {
      holderName: string;
      accountNumber: string;
      ifsc: string;
      upiId: string;
    };
    documents: Array<{
      id: string;
      title: string;
      sizeLabel: string;
      thumbnail: string;
      url?: string;
    }>;
    videoThumb: string;
    videoUrl?: string;
  };
};

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export async function fetchReceiverStats() {
  return apiRequest<{stats: AdminReceiverStats}>('/admin/receivers/stats');
}

export async function fetchReceivers(params: {
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
    receivers: AdminReceiverListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/receivers${qs ? `?${qs}` : ''}`);
}

export async function fetchReceiver(id: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}`,
  );
}

export async function updateReceiverStatus(
  id: string,
  action: 'block' | 'suspend' | 'activate' | 'warn',
  reason?: string,
) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({action, reason}),
    },
  );
}

export async function updateReceiverProfile(
  id: string,
  payload: {
    name?: string;
    email?: string;
    age?: number;
    gender?: string;
    level?: number;
    bio?: string;
    languages?: string[] | string;
  },
) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}

export async function assignReceiverAgent(id: string, agentId: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}/assign-agent`,
    {
      method: 'POST',
      body: JSON.stringify({agentId}),
    },
  );
}

export type PendingReceiverRow = {
  id: string;
  name: string;
  photoCount: number;
  submittedAgo: string;
  level: number;
  agentId?: string;
  agentName?: string;
  agentCode?: string;
};

export async function fetchPendingReceivers() {
  return apiRequest<{pending: PendingReceiverRow[]}>(
    '/admin/receivers/pending',
  );
}

export async function approveReceiver(id: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}/approve`,
    {method: 'POST'},
  );
}

export async function rejectReceiver(id: string, reason: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}/reject`,
    {method: 'POST', body: JSON.stringify({reason})},
  );
}

export async function requestReceiverChanges(id: string, note?: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}/request-changes`,
    {method: 'POST', body: JSON.stringify({note})},
  );
}

export async function terminateReceiver(id: string, reason?: string) {
  return apiRequest<{receiver: AdminReceiverProfile}>(
    `/admin/receivers/${id}/terminate`,
    {method: 'POST', body: JSON.stringify({reason})},
  );
}
