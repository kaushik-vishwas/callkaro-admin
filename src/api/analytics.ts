import {apiRequest} from './client';

export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  tone?: string;
  trend?: 'up' | 'down';
};

export type ChartPoint = {label: string; value: number; date?: string};

export type ActivityItem = {id: string; text: string; time: string};

export type PackageCard = {
  id: string;
  priceLabel: string;
  coins: string;
  revenue: string;
  revenueValue?: number;
  buyers: number;
  orders?: number;
  tone?: string;
};

export type CallerRanking = {
  rank: number;
  id?: string;
  name: string;
  totalSpend: number;
  coinsPurchased: number;
  callsMade: number;
  talkTime: string;
  lifetimeRevenue: number;
};

export type ReceiverRanking = {
  rank: number;
  id?: string;
  name: string;
  callsHandled: number;
  coinsEarned: number;
  revenue: number;
  onlineTime: string;
  idleTime: string;
  utilization: number;
};

export type AgentRanking = {
  rank: number;
  id?: string;
  name: string;
  receivers: number;
  revenue: number;
  commission: number;
  avgReceiverRevenue: number;
  growth: number;
};

export type AgentBreakdown = {
  id?: string;
  name: string;
  revenue: number;
  commission: number;
};

export type GrossSplit = {
  id: string;
  label: string;
  percent: number;
  amount: number;
  color: string;
};

export type GrossMonthly = {
  label: string;
  platform: number;
  receiver: number;
  agent: number;
  gross?: number;
};

export type WaterfallItem = {
  id: string;
  label: string;
  value: number;
  kind: 'start' | 'deduction' | 'end';
  color: string;
};

function qs(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const s = search.toString();
  return s ? `?${s}` : '';
}

export async function fetchAnalyticsOverview(rangeDays = 30) {
  return apiRequest<{
    overview: {
      rangeDays: number;
      kpis: AnalyticsKpi[];
      revenueSeries: ChartPoint[];
      userGrowth: ChartPoint[];
      activityFeed: ActivityItem[];
    };
  }>(`/admin/analytics/overview${qs({rangeDays})}`);
}

export async function fetchAnalyticsPackages(rangeDays = 30) {
  return apiRequest<{rangeDays: number; packages: PackageCard[]}>(
    `/admin/analytics/packages${qs({rangeDays})}`,
  );
}

export async function fetchAnalyticsCallers(limit = 10, rangeDays = 30) {
  return apiRequest<{
    rangeDays: number;
    limit: number;
    rankings: CallerRanking[];
  }>(`/admin/analytics/callers${qs({limit, rangeDays})}`);
}

export async function fetchAnalyticsReceivers(
  period: string = 'monthly',
  limit = 50,
) {
  return apiRequest<{period: string; rankings: ReceiverRanking[]}>(
    `/admin/analytics/receivers${qs({period, limit})}`,
  );
}

export async function fetchAnalyticsAgents(period: string = 'monthly') {
  return apiRequest<{
    period: string;
    rankings: AgentRanking[];
    breakdown: AgentBreakdown[];
    topAgentId?: string | null;
  }>(`/admin/analytics/agents${qs({period})}`);
}

export async function fetchAnalyticsGrossProfit(rangeDays = 30) {
  return apiRequest<{
    grossProfit: {
      rangeDays: number;
      totalGrossRevenue: number;
      netPlatformShare: number;
      split: GrossSplit[];
      monthly: GrossMonthly[];
    };
  }>(`/admin/analytics/gross-profit${qs({rangeDays})}`);
}

export async function fetchAnalyticsNetProfit(rangeDays = 30) {
  return apiRequest<{
    netProfit: {
      rangeDays: number;
      grossRevenue: number;
      totalDeductions: number;
      netRevenue: number;
      netMargin: string;
      waterfall: WaterfallItem[];
    };
  }>(`/admin/analytics/net-profit${qs({rangeDays})}`);
}

export function formatInr(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}
