import {apiRequest} from './client';
import type {CallSplit} from './callRates';

export type PlatformSettings = {
  coinsPerChatMessage: number;
  milestone30Coins: number;
  milestone60Coins: number;
  milestone120Coins: number;
  welcomeFreeMinutes: number;
  /** Stored as a fraction, e.g. 0.03 = 3%. */
  withdrawFeeRate: number;
  withdrawMinBalanceInr: number;
  withdrawMinAmountInr: number;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
};

export type MoneySettingsResponse = {
  settings: PlatformSettings;
  coinsPerRupee: number;
  callSplit: CallSplit;
};

export function fetchMoneySettings() {
  return apiRequest<MoneySettingsResponse>('/admin/money-settings');
}

export function updatePlatformSettings(input: Partial<PlatformSettings>) {
  return apiRequest<{settings: PlatformSettings}>('/admin/money-settings', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}
