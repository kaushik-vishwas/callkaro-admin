import {apiRequest} from './client';

export type MissedDayPolicy = 'forfeit' | 'pause';
export type ExtensionPolicy = 'extend' | 'restart' | 'none';
export type CampaignStatus = 'active' | 'inactive';

export type RewardCampaign = {
  id: string;
  name: string;
  minRechargeInr: number;
  durationDays: number;
  dailyCoins: number[];
  totalCoins: number;
  status: CampaignStatus;
  startsAt: string | null;
  endsAt: string | null;
  missedDayPolicy: MissedDayPolicy;
  extensionPolicy: ExtensionPolicy;
  enrolledCallers: number;
  completedCallers: number;
  coinsDistributed: number;
  createdAt?: string;
};

export type CampaignInput = {
  name: string;
  minRechargeInr: number;
  dailyCoins: number[];
  status: CampaignStatus;
  startsAt: string | null;
  endsAt: string | null;
  missedDayPolicy: MissedDayPolicy;
  extensionPolicy: ExtensionPolicy;
};

export type CampaignReportRow = {
  callerId: string;
  callerName: string;
  rechargeAmountInr: number;
  rechargeCount: number;
  daysClaimed: number;
  totalDays: number;
  totalCoins: number;
  status: string;
  startDate: string;
};

export type CallerHistory = {
  callerId: string;
  callerName: string;
  campaign: {id: string; name: string};
  status: string | null;
  startDate: string | null;
  rechargeAmountInr: number;
  totalCoins: number;
  claims: {day: number; coins: number; claimDate: string; runStartDate: string | null; createdAt: string}[];
};

export function fetchRewardCampaigns() {
  return apiRequest<{
    campaigns: RewardCampaign[];
    summary: {promoCoinsDistributed: number; claimsMade: number};
  }>('/admin/reward-campaigns');
}

export function createRewardCampaign(payload: CampaignInput) {
  return apiRequest<{campaign: RewardCampaign}>('/admin/reward-campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateRewardCampaign(id: string, payload: Partial<CampaignInput>) {
  return apiRequest<{campaign: RewardCampaign}>(
    `/admin/reward-campaigns/${encodeURIComponent(id)}`,
    {method: 'PATCH', body: JSON.stringify(payload)},
  );
}

export function fetchCampaignReport(id: string, limit = 100) {
  return apiRequest<{
    campaign: RewardCampaign;
    items: CampaignReportRow[];
    total: number;
  }>(`/admin/reward-campaigns/${encodeURIComponent(id)}/report?limit=${limit}`);
}

export function fetchCallerCampaignHistory(campaignId: string, callerId: string) {
  return apiRequest<{history: CallerHistory}>(
    `/admin/reward-campaigns/${encodeURIComponent(campaignId)}/callers/${encodeURIComponent(callerId)}`,
  );
}
