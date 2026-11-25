import {apiRequest} from './client';

export type KpiItem = {
  id: string;
  label: string;
  value: string;
  /** Small secondary line under the value, e.g. "+12 in last 7 days". */
  hint?: string;
  trend?: 'up' | 'down';
  /** Per-category counts shown in a popup on hover (failure cards). */
  breakdown?: {id: string; label: string; value: number}[];
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'pink' | 'amber' | 'green' | 'blue';
};

export type HourBucket = {
  hour: number;
  call: number;
  online: number;
  idle: number;
};

export type RevenuePoint = {
  day: string;
  date?: string;
  value: number;
};

export type DashboardRange = 1 | 7 | 30 | 90;

export type DashboardSection = 'kpis' | 'revenue' | 'idle' | 'activity';

export type DashboardData = {
  kpiDays: number;
  revenueDays: number;
  idleDays: number;
  generatedAt: string;
  kpisTop: KpiItem[];
  kpisBottom: KpiItem[];
  revenueSeries: RevenuePoint[];
  activityFeed: ActivityItem[];
  receiverActivity: HourBucket[];
  callerActivity: HourBucket[];
  receiverMaxY: number;
  callerMaxY: number;
  raw?: Record<string, number>;
};

export type DashboardQuery = {
  kpiDays: DashboardRange;
  revenueDays: DashboardRange;
  idleDays: DashboardRange;
  sections?: DashboardSection[];
};

export type IdleReceiver = {
  rank: number;
  id: string;
  name: string;
  age: number | null;
  level: number | null;
  avatarUrl: string;
  isOnline: boolean;
  status: string | null;
  onlineMinutes: number;
  callMinutes: number;
  idleMinutes: number;
  utilizationPct: number;
};

export type IdleReceiversPage = {
  rangeDays: number;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  receivers: IdleReceiver[];
};

export async function fetchIdleReceivers(days: DashboardRange, page = 1) {
  const qs = new URLSearchParams({
    days: String(days),
    page: String(page),
    limit: '10',
  });
  return apiRequest<IdleReceiversPage>(
    `/admin/dashboard/idle-receivers?${qs.toString()}`,
  );
}

export async function fetchDashboard({
  kpiDays,
  revenueDays,
  idleDays,
  sections,
}: DashboardQuery) {
  const qs = new URLSearchParams({
    kpiDays: String(kpiDays),
    revenueDays: String(revenueDays),
    idleDays: String(idleDays),
  });
  if (sections?.length) qs.set('sections', sections.join(','));
  return apiRequest<{dashboard: Partial<DashboardData>}>(
    `/admin/dashboard?${qs.toString()}`,
  );
}
