export type WithdrawalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'successful';

export type WithdrawalSort = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

export type RecentWithdrawal = {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'successful' | 'pending' | 'rejected' | 'approved';
};

export type WithdrawalItem = {
  id: string;
  code: string;
  userId: string;
  receiverName: string;
  initials: string;
  amount: number;
  feeInr?: number;
  netInr?: number;
  requestDate: string;
  requestDateLabel: string;
  status: WithdrawalStatus;
  rawStatus?: string;
  mobile: string;
  level: string;
  accountStatus: 'active' | 'blocked' | 'suspended';
  walletBalance: number;
  totalEarnings: number;
  pendingAmount: number;
  prevWithdrawalsLabel: string;
  bankName: string;
  accountHolder: string;
  ifsc: string;
  accountNumber: string;
  utr?: string;
  paidAt?: string | null;
  paidAtLabel?: string;
  failureReason?: string;
  recentWithdrawals: RecentWithdrawal[];
};

export type WithdrawalStats = {
  totalTransactions: number;
  pendingWithdrawals?: number;
  paidWithdrawalsTotal?: number;
  paidWithdrawalsLabel?: string;
  vipPurchases: number;
  totalRevenue: number;
  totalRevenueLabel: string;
};

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}
