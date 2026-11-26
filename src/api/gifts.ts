import {apiRequest, getApiBaseUrl, getStoredToken, ApiError} from './client';

export type GiftCategory = 'Basic' | 'Romantic' | 'Premium' | 'Luxury';
export type GiftStatus = 'active' | 'inactive';

export type AdminGift = {
  id: string;
  name: string;
  emoji: string;
  /** True when an image was uploaded; false when the bundled default artwork is shown. */
  hasCustomImage?: boolean;
  category: GiftCategory;
  coins: number;
  mediaUrl: string | null;
  mediaType: 'image' | 'animation' | '';
  status: GiftStatus;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GiftSplit = {
  adminPercent: number;
  receiverPercent: number;
  agentPercent: number;
};

export type GiftInput = {
  name: string;
  emoji?: string;
  category: GiftCategory;
  coins: number;
  status: GiftStatus;
};

export type GiftTransactionItem = {
  id: string;
  callId: string;
  callerId: string;
  receiverId: string;
  agentId: string | null;
  giftId: string;
  giftName: string;
  giftEmoji: string;
  giftCategory: string;
  unitCoins: number;
  quantity: number;
  totalCoins: number;
  adminCoins: number;
  receiverCoins: number;
  agentCoins: number;
  adminInr: number;
  receiverInr: number;
  agentInr: number;
  creditStatus: 'pending' | 'credited' | 'failed';
  createdAt: string;
};

export type GiftSummary = {
  transactions: number;
  giftsSent: number;
  totalCoins: number;
  totalInr: number;
  adminCoins: number;
  receiverCoins: number;
  agentCoins: number;
  adminInr: number;
  receiverInr: number;
  agentInr: number;
  failedCredits: number;
  byGift: {giftId: string; giftName: string; giftsSent: number; totalCoins: number}[];
  split: GiftSplit;
};

export function fetchGifts() {
  return apiRequest<{gifts: AdminGift[]; categories: GiftCategory[]; split: GiftSplit}>(
    '/admin/gifts',
  );
}

export function createGift(payload: GiftInput) {
  return apiRequest<{gift: AdminGift}>('/admin/gifts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateGift(id: string, payload: Partial<GiftInput>) {
  return apiRequest<{gift: AdminGift}>(`/admin/gifts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteGift(id: string) {
  return apiRequest<{id: string}>(`/admin/gifts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** Multipart upload: must not set Content-Type, so it bypasses apiRequest. */
export async function uploadGiftMedia(id: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const headers = new Headers();
  const token = getStoredToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(
    `${getApiBaseUrl()}/admin/gifts/${encodeURIComponent(id)}/media`,
    {method: 'POST', headers, body: form},
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new ApiError(body.message || 'Upload failed.', response.status);
  }
  return body.data as {gift: AdminGift};
}

export function fetchGiftSplit() {
  return apiRequest<{split: GiftSplit}>('/admin/gifts/split');
}

export function updateGiftSplit(payload: GiftSplit) {
  return apiRequest<{split: GiftSplit}>('/admin/gifts/split', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function fetchGiftTransactions(limit = 25) {
  return apiRequest<{items: GiftTransactionItem[]; total: number}>(
    `/admin/gifts/transactions?limit=${limit}`,
  );
}

export function fetchGiftSummary() {
  return apiRequest<{summary: GiftSummary}>('/admin/gifts/summary');
}
