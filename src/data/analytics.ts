export type AnalyticsTabId =
  | 'overview'
  | 'packages'
  | 'callers'
  | 'receivers'
  | 'agents'
  | 'gross-profit'
  | 'net-profit';

export const ANALYTICS_TABS: Array<{id: AnalyticsTabId; label: string; to: string}> = [
  {id: 'overview', label: 'Overview', to: '/analytics'},
  {id: 'packages', label: 'Package Economics', to: '/analytics/packages'},
  {id: 'callers', label: 'Caller Rankings', to: '/analytics/callers'},
  {id: 'receivers', label: 'Receiver Rankings', to: '/analytics/receivers'},
  {id: 'agents', label: 'Agent Rankings', to: '/analytics/agents'},
  {id: 'gross-profit', label: 'Gross Profit', to: '/analytics/gross-profit'},
  {id: 'net-profit', label: 'Net Profit', to: '/analytics/net-profit'},
];

export const OVERVIEW_KPIS = [
  {id: 'downloads', label: 'Downloads', value: '245K', tone: 'pink'},
  {id: 'registered', label: 'Registered Users', value: '185K', tone: 'purple'},
  {id: 'receivers', label: 'Total Receivers', value: '12.4K', tone: 'blue'},
  {id: 'activeReceivers', label: 'Active Receivers', value: '8.3K', tone: 'green'},
  {id: 'agents', label: 'Total Agents', value: '450', tone: 'gold'},
  {id: 'franchises', label: 'Total Franchises', value: '35', tone: 'dark'},
  {id: 'dau', label: 'DAU', value: '18.2K', tone: 'pink'},
  {id: 'wau', label: 'WAU', value: '45K', tone: 'purple'},
  {id: 'mau', label: 'MAU', value: '82K', tone: 'blue'},
  {id: 'totalUsers', label: 'Total Users', value: '5.24M', tone: 'dark'},
  {id: 'revenue', label: 'Revenue', value: '₹824.5K', tone: 'green', trend: 'up'},
  {id: 'withdrawals', label: 'Withdrawals', value: '₹12.4K', tone: 'gold'},
  {id: 'calls', label: 'Total Calls', value: '1.2M', tone: 'pink'},
  {id: 'avgSession', label: 'Avg Session', value: '8m 12s', tone: 'purple'},
  {id: 'conversion', label: 'Conversion', value: '4.8%', tone: 'green'},
];

export const REVENUE_WEEK = [
  {label: 'Mon', value: 92000},
  {label: 'Tue', value: 110000},
  {label: 'Wed', value: 98000},
  {label: 'Thu', value: 125000},
  {label: 'Fri', value: 142000},
  {label: 'Sat', value: 168000},
  {label: 'Sun', value: 155000},
];

export const USER_GROWTH = [
  {label: 'Jan', value: 120000},
  {label: 'Feb', value: 145000},
  {label: 'Mar', value: 162000},
  {label: 'Apr', value: 178000},
  {label: 'May', value: 185000},
];

export const LIVE_ACTIVITY = [
  {id: 'a1', text: 'Priya Kumar (New user registered)', time: '2m ago'},
  {id: 'a2', text: 'Rahul Singh (Withdrew ₹500)', time: '4m ago'},
  {id: 'a3', text: 'Ananya + Riya (Call started)', time: '6m ago'},
  {id: 'a4', text: 'User #AS21 (Report submitted)', time: '8m ago'},
  {id: 'a5', text: 'Receiver #234 (Requested KYC Link)', time: '12m ago'},
  {id: 'a6', text: 'Karan Mehta (Purchased VIP Club)', time: '15m ago'},
];

export const PACKAGES = [
  {id: 'p1', priceLabel: '₹199 Package', coins: '2,000 Coins', revenue: '₹2,82,000', buyers: 1417, tone: 'pink'},
  {id: 'p2', priceLabel: '₹499 Package', coins: '12,000 Coins', revenue: '₹4,15,000', buyers: 832, tone: 'purple'},
  {id: 'p3', priceLabel: '₹999 Package', coins: '25,000 Coins', revenue: '₹6,28,000', buyers: 628, tone: 'blue'},
  {id: 'p4', priceLabel: '₹199 Package', coins: '5,000 Coins', revenue: '₹1,94,000', buyers: 974, tone: 'gold'},
  {id: 'p5', priceLabel: '₹459 Package', coins: '15,000 Coins', revenue: '₹3,42,000', buyers: 745, tone: 'green'},
  {id: 'p6', priceLabel: '₹299 Package', coins: '10,000 Coins', revenue: '₹2,56,000', buyers: 856, tone: 'dark'},
];

export const CALLER_RANKINGS = [
  {rank: 1, name: 'Vikram Nair', totalSpend: 48200, coinsPurchased: 1205000, callsMade: 420, talkTime: '1,260 min', lifetimeRevenue: 284000},
  {rank: 2, name: 'Arjun Sharma', totalSpend: 41800, coinsPurchased: 980000, callsMade: 385, talkTime: '1,120 min', lifetimeRevenue: 246000},
  {rank: 3, name: 'Rohan Mehta', totalSpend: 39200, coinsPurchased: 875000, callsMade: 360, talkTime: '980 min', lifetimeRevenue: 221000},
  {rank: 4, name: 'Kabir Das', totalSpend: 35600, coinsPurchased: 812000, callsMade: 340, talkTime: '910 min', lifetimeRevenue: 198000},
  {rank: 5, name: 'Dev Patel', totalSpend: 32100, coinsPurchased: 740000, callsMade: 310, talkTime: '840 min', lifetimeRevenue: 176000},
  {rank: 6, name: 'Aarav Joshi', totalSpend: 29800, coinsPurchased: 690000, callsMade: 295, talkTime: '780 min', lifetimeRevenue: 162000},
  {rank: 7, name: 'Ishaan Kapoor', totalSpend: 27500, coinsPurchased: 640000, callsMade: 270, talkTime: '720 min', lifetimeRevenue: 148000},
  {rank: 8, name: 'Yash Verma', totalSpend: 25100, coinsPurchased: 580000, callsMade: 250, talkTime: '680 min', lifetimeRevenue: 134000},
  {rank: 9, name: 'Neil Reddy', totalSpend: 22800, coinsPurchased: 520000, callsMade: 230, talkTime: '620 min', lifetimeRevenue: 121000},
  {rank: 10, name: 'Kabir Khan', totalSpend: 20400, coinsPurchased: 470000, callsMade: 210, talkTime: '560 min', lifetimeRevenue: 108000},
];

export const RECEIVER_RANKINGS = [
  {rank: 1, name: 'Priya Sharma', callsHandled: 823, coinsEarned: 823000, revenue: 32920, onlineTime: '420 hr', idleTime: '80 hr', utilization: 84},
  {rank: 2, name: 'Ananya Singh', callsHandled: 790, coinsEarned: 790000, revenue: 31600, onlineTime: '405 hr', idleTime: '85 hr', utilization: 82},
  {rank: 3, name: 'Neha Kapoor', callsHandled: 745, coinsEarned: 745000, revenue: 29800, onlineTime: '390 hr', idleTime: '90 hr', utilization: 81},
  {rank: 4, name: 'Riya Nair', callsHandled: 710, coinsEarned: 710000, revenue: 28400, onlineTime: '375 hr', idleTime: '95 hr', utilization: 80},
  {rank: 5, name: 'Kavya Reddy', callsHandled: 680, coinsEarned: 680000, revenue: 27200, onlineTime: '360 hr', idleTime: '100 hr', utilization: 78},
  {rank: 6, name: 'Isha Mehta', callsHandled: 650, coinsEarned: 650000, revenue: 26000, onlineTime: '345 hr', idleTime: '105 hr', utilization: 77},
  {rank: 7, name: 'Sana Mirza', callsHandled: 620, coinsEarned: 620000, revenue: 24800, onlineTime: '330 hr', idleTime: '110 hr', utilization: 75},
  {rank: 8, name: 'Pooja Verma', callsHandled: 590, coinsEarned: 590000, revenue: 23600, onlineTime: '315 hr', idleTime: '115 hr', utilization: 73},
];

export const AGENT_RANKINGS = [
  {rank: 1, name: 'Sumit Agarwal', receivers: 24, revenue: 482000, commission: 24100, avgReceiverRevenue: 20083, growth: 3.5},
  {rank: 2, name: 'Amit Verma', receivers: 21, revenue: 421000, commission: 21050, avgReceiverRevenue: 20047, growth: 2.8},
  {rank: 3, name: 'Rahul Khanna', receivers: 19, revenue: 386000, commission: 19300, avgReceiverRevenue: 20315, growth: 2.1},
  {rank: 4, name: 'Vikas Shah', receivers: 17, revenue: 342000, commission: 17100, avgReceiverRevenue: 20117, growth: 1.6},
  {rank: 5, name: 'Nikhil Rao', receivers: 15, revenue: 298000, commission: 14900, avgReceiverRevenue: 19866, growth: 1.2},
];

export const AGENT_BREAKDOWN = [
  {name: 'Priya Sharma', revenue: 82000, commission: 4100},
  {name: 'Ananya Singh', revenue: 76000, commission: 3800},
  {name: 'Neha Kapoor', revenue: 71000, commission: 3550},
  {name: 'Riya Nair', revenue: 68000, commission: 3400},
  {name: 'Kavya Reddy', revenue: 64000, commission: 3200},
];

export const GROSS_PROFIT = {
  totalGrossRevenue: 824500,
  netPlatformShare: 576150,
  split: [
    {id: 'platform', label: 'Platform', percent: 70, amount: 576150, color: '#1e3a8a'},
    {id: 'receiver', label: 'Receiver', percent: 25, amount: 206124, color: '#ec4899'},
    {id: 'agent', label: 'Agent', percent: 5, amount: 41210, color: '#f59e0b'},
  ],
  monthly: [
    {label: 'Jan', platform: 420000, receiver: 150000, agent: 30000},
    {label: 'Feb', platform: 460000, receiver: 165000, agent: 33000},
    {label: 'Mar', platform: 510000, receiver: 182000, agent: 36000},
    {label: 'Apr', platform: 545000, receiver: 195000, agent: 39000},
    {label: 'May', platform: 576150, receiver: 206124, agent: 41210},
  ],
};

export const NET_PROFIT = {
  grossRevenue: 824500,
  totalDeductions: 313310,
  netRevenue: 511190,
  netMargin: '62.0%',
  waterfall: [
    {id: 'gross', label: 'Gross Revenue', value: 824500, kind: 'start' as const, color: '#1e3a8a'},
    {id: 'gst', label: 'GST (18%)', value: -148410, kind: 'deduction' as const, color: '#ef4444'},
    {id: 'play', label: 'Google Play (15%)', value: -123675, kind: 'deduction' as const, color: '#f97316'},
    {id: 'gw', label: 'Payment GW (2%)', value: -16490, kind: 'deduction' as const, color: '#eab308'},
    {id: 'video', label: 'Video API (2%)', value: -16490, kind: 'deduction' as const, color: '#8b5cf6'},
    {id: 'misc', label: 'Misc (1%)', value: -8245, kind: 'deduction' as const, color: '#9ca3af'},
    {id: 'net', label: 'Net Revenue', value: 511190, kind: 'end' as const, color: '#ec4899'},
  ],
};

export function formatInr(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export function resolveAnalyticsTab(tab?: string): AnalyticsTabId {
  const match = ANALYTICS_TABS.find(item => item.id === tab);
  return match?.id || 'overview';
}
