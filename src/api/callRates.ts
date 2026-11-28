import {apiRequest} from './client';

export type CallRate = {
  level: number;
  label: string;
  coinsPerMinute: number;
  receiverSharePerMinute: number;
  /** VIP caller rate per subscription plan. */
  vipCoinsPerMinute: {weekly: number; monthly: number};
};

export type CallSplit = {
  receiverPercent: number;
  agentPercent: number;
  adminPercent: number;
};

export type CallRatesResponse = {
  rates: CallRate[];
  /** Coins that equal ₹1 (admin-editable). */
  coinsPerRupee: number;
  /** Split of call and chat earnings, in percent (must total 100). */
  callSplit: CallSplit;
};

export function updateCallSplit(split: CallSplit) {
  return apiRequest<{callSplit: CallSplit}>('/admin/call-split', {
    method: 'PUT',
    body: JSON.stringify(split),
  });
}

export function fetchCallRates() {
  return apiRequest<CallRatesResponse>('/admin/call-rates');
}

export function updateCallRate(level: number, coinsPerMinute: number) {
  return apiRequest<{rate: CallRate}>(`/admin/call-rates/${level}`, {
    method: 'PATCH',
    body: JSON.stringify({coinsPerMinute}),
  });
}

export function updateCoinValue(coinsPerRupee: number) {
  return apiRequest<{coinsPerRupee: number}>('/admin/coin-value', {
    method: 'PUT',
    body: JSON.stringify({coinsPerRupee}),
  });
}
