import {apiRequest} from './client';

export type KpiItem = {
  id: string;
  label: string;
  value: string;
  trend?: 'up' | 'down';
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

export type DashboardData = {
  rangeDays: number;
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

export async function fetchDashboard(rangeDays = 30) {
  const qs = new URLSearchParams({rangeDays: String(rangeDays)});
  return apiRequest<{dashboard: DashboardData}>(
    `/admin/dashboard?${qs.toString()}`,
  );
}
