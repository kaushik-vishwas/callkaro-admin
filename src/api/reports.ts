import {apiRequest} from './client';

export type TicketUserType = 'caller' | 'receiver' | 'agent';
export type TicketStatus = 'open' | 'resolved' | 'ignored';
export type TicketAdminAction = 'none' | 'ignore' | 'terminate';

export type TicketAttachment = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf';
  sizeLabel: string;
};

export type TicketItem = {
  id: string;
  code: string;
  reportBy: string;
  reportById: string;
  reportTo: string;
  reportToId: string;
  issueType: string;
  categories: string[];
  status: TicketStatus;
  userType: TicketUserType;
  reportedRole?: 'caller' | 'receiver';
  conversationId?: string;
  createdAt: string;
  createdLabel: string;
  description: string;
  assignedToAdmin: boolean;
  attachments: TicketAttachment[];
  adminAction?: TicketAdminAction;
};

export type TicketStats = {
  total: number;
  open: number;
  resolved: number;
  ignored?: number;
};

export async function fetchReportStats() {
  return apiRequest<{stats: TicketStats}>('/admin/reports/stats');
}

export async function fetchReports(
  params: {
    q?: string;
    status?: string;
    userType?: string;
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
    tickets: TicketItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/reports${qs ? `?${qs}` : ''}`);
}

export async function fetchReport(id: string) {
  return apiRequest<{ticket: TicketItem}>(
    `/admin/reports/${encodeURIComponent(id)}`,
  );
}

export async function ignoreReport(id: string) {
  return apiRequest<{ticket: TicketItem}>(
    `/admin/reports/${encodeURIComponent(id)}/ignore`,
    {method: 'POST', body: JSON.stringify({})},
  );
}

export async function terminateReport(id: string, reason?: string) {
  return apiRequest<{ticket: TicketItem}>(
    `/admin/reports/${encodeURIComponent(id)}/terminate`,
    {
      method: 'POST',
      body: JSON.stringify({reason: reason || undefined}),
    },
  );
}
