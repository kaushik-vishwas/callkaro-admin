import {apiRequest} from './client';

export type RechargePackStatus = 'active' | 'inactive';

export type RechargePack = {
  id: string;
  amountInr: number;
  coins: number;
  status: RechargePackStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type RechargePackInput = {
  amountInr: number;
  coins: number;
  status: RechargePackStatus;
};

export function fetchRechargePacks() {
  return apiRequest<{packs: RechargePack[]}>('/admin/recharge-packs');
}

export function createRechargePack(payload: RechargePackInput) {
  return apiRequest<{pack: RechargePack}>('/admin/recharge-packs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateRechargePack(
  id: string,
  payload: Partial<RechargePackInput>,
) {
  return apiRequest<{pack: RechargePack}>(
    `/admin/recharge-packs/${encodeURIComponent(id)}`,
    {method: 'PATCH', body: JSON.stringify(payload)},
  );
}

export function deleteRechargePack(id: string) {
  return apiRequest<{id: string}>(
    `/admin/recharge-packs/${encodeURIComponent(id)}`,
    {method: 'DELETE'},
  );
}
