import {apiRequest} from './client';

export type SupportTicketRole = 'caller' | 'receiver';
export type SupportTicketStatus = 'open' | 'in_review' | 'solved' | 'closed';

export type SupportTicketAttachment = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf';
  sizeLabel: string;
  url?: string;
};

export type SupportTicketItem = {
  id: string;
  code: string;
  role: SupportTicketRole;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: string;
  subject: string;
  description: string;
  mobile: string;
  email: string;
  status: SupportTicketStatus;
  statusLabel: string;
  adminNote: string;
  attachments: SupportTicketAttachment[];
  createdAt: string;
  createdLabel: string;
  updatedAt?: string | null;
  resolvedAt?: string | null;
};

export type SupportTicketStats = {
  total: number;
  open: number;
  inReview?: number;
  solved?: number;
  closed?: number;
  resolved: number;
};

export async function fetchSupportTicketStats() {
  return apiRequest<{stats: SupportTicketStats}>('/admin/support-tickets/stats');
}

export async function fetchSupportTickets(
  params: {
    q?: string;
    status?: string;
    role?: string;
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
    tickets: SupportTicketItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/support-tickets${qs ? `?${qs}` : ''}`);
}

export async function fetchSupportTicket(id: string) {
  return apiRequest<{ticket: SupportTicketItem}>(
    `/admin/support-tickets/${encodeURIComponent(id)}`,
  );
}

export async function updateSupportTicketStatus(
  id: string,
  input: {status: SupportTicketStatus; adminNote?: string},
) {
  return apiRequest<{ticket: SupportTicketItem}>(
    `/admin/support-tickets/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}
