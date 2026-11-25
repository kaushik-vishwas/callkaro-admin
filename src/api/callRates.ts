import {apiRequest} from './client';

export type CallRate = {
  level: number;
  label: string;
  coinsPerMinute: number;
  receiverSharePerMinute: number;
  /** VIP caller rate per subscription plan. */
  vipCoinsPerMinute: {weekly: number; monthly: number};
};

export function fetchCallRates() {
  return apiRequest<{rates: CallRate[]}>('/admin/call-rates');
}

export function updateCallRate(level: number, coinsPerMinute: number) {
  return apiRequest<{rate: CallRate}>(`/admin/call-rates/${level}`, {
    method: 'PATCH',
    body: JSON.stringify({coinsPerMinute}),
  });
}
