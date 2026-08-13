import {apiRequest} from './client';

export type ComplianceSource = 'identity_mismatch' | 'detected' | 'chat' | 'in_call';

export type ComplianceStatus =
  | 'pending'
  | 'assigned'
  | 'agent_accepted'
  | 'agent_ignored'
  | 'dismissed'
  | 'blocked'
  | 'closed'
  | 'under_appeal';

export type ComplianceCase = {
  id: string;
  caseCode: string;
  source: string;
  sourceLabel: string;
  detectionSource: string;
  detectionType: string;
  callId?: string | null;
  conversationId?: string | null;
  reportDate: string;
  reportDateLabel: string;
  callerName: string;
  callerPhone: string;
  callerId: string;
  receiverName: string;
  receiverId: string;
  receiverPriorViolations: number;
  receiverStatus: string;
  receiverMemberSince: string;
  assignedAgentId: string;
  assignedAgentName: string;
  assignedAgentCode: string;
  status: ComplianceStatus;
  statusLabel: string;
  reason: string;
  details: string;
  riskScore?: number | null;
  videoEvidence: boolean;
  videoUrl?: string;
  videoThumb?: string;
  duplicateLabel: string;
  autoBlockAt?: string | null;
  autoBlockLabel?: string;
  timeline: Array<{
    id: string;
    title: string;
    actor: string;
    at: string | null;
    atLabel: string;
  }>;
  adminAction?: string;
  assignmentNote?: string;
};

export type IdentityStats = {
  total: number;
  pending: number;
  assigned: number;
  highRisk: number;
  underAppeal: number;
  banned: number;
};

export type DetectedStats = {
  total: number;
  pending: number;
  blockedToday: number;
};

export async function fetchComplianceStats(source: ComplianceSource | string) {
  const qs = new URLSearchParams({source});
  return apiRequest<{stats: IdentityStats & DetectedStats}>(
    `/admin/compliance/stats?${qs.toString()}`,
  );
}

export async function fetchComplianceCases(
  params: {
    source?: string;
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    detectionSource?: string;
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
    cases: ComplianceCase[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/admin/compliance/cases${qs ? `?${qs}` : ''}`);
}

export async function fetchComplianceCase(id: string) {
  return apiRequest<{case: ComplianceCase}>(
    `/admin/compliance/cases/${encodeURIComponent(id)}`,
  );
}

export async function assignComplianceCase(
  id: string,
  agentId: string,
  note?: string,
) {
  return apiRequest<{case: ComplianceCase}>(
    `/admin/compliance/cases/${encodeURIComponent(id)}/assign`,
    {
      method: 'POST',
      body: JSON.stringify({agentId, note}),
    },
  );
}

export async function dismissComplianceCase(id: string, reason?: string) {
  return apiRequest<{case: ComplianceCase}>(
    `/admin/compliance/cases/${encodeURIComponent(id)}/dismiss`,
    {
      method: 'POST',
      body: JSON.stringify({reason}),
    },
  );
}

export async function blockComplianceCase(id: string, reason?: string) {
  return apiRequest<{case: ComplianceCase}>(
    `/admin/compliance/cases/${encodeURIComponent(id)}/block`,
    {
      method: 'POST',
      body: JSON.stringify({reason}),
    },
  );
}
