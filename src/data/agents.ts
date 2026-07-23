export type AgentStatus = 'active' | 'inactive';

export type AgentListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joinedAt: string;
  lastActive: string;
  receivers: number;
  revenue: number;
  commission: number;
  pending: number;
  rank: number;
  status: AgentStatus;
  highRevenue: boolean;
  topCommission: boolean;
};

export type AgentReceiverRow = {
  id: string;
  name: string;
  calls: number;
  coinsEarned: number;
  revenue: number;
  commission: number;
  status: 'active' | 'inactive' | 'blocked';
};

export type AgentTimelineItem = {
  id: string;
  title: string;
  detail: string;
  tone: 'pink' | 'amber' | 'green' | 'purple';
};

export type AgentProfile = AgentListItem & {
  availableBalance: number;
  team: {
    totalReceivers: number;
    activeReceivers: number;
    onlineNow: number;
    blocked: number;
    inactive: number;
  };
  commissionDashboard: {
    totalEarned: number;
    pending: number;
    available: number;
    lifetimeEarnings: number;
    totalRevenueGenerated: number;
  };
  revenueAnalytics: {
    totalRevenue: number;
    avgRevPerReceiver: number;
    monthlyRevenue: number;
    growthPct: number;
    revenueRank: number;
  };
  earningsTrend: Array<{month: string; value: number}>;
  receiverPerformance: AgentReceiverRow[];
  timeline: AgentTimelineItem[];
};

export const agentsDirectoryStats = {
  totalAgents: 1284,
  activeAgents: 986,
  topPerforming: 124,
  totalCommissionLabel: '₹ 18.4L',
  revenueViaAgentsLabel: '₹ 92.1L',
};

export const agents: AgentListItem[] = [
  {
    id: 'ag01',
    code: '#AG01',
    name: 'Rahul Mehta',
    phone: '+91 98765 43210',
    email: 'rahul@callkaro.in',
    location: 'Mumbai, MH',
    joinedAt: '1 Dec 2023',
    lastActive: '5 min ago',
    receivers: 24,
    revenue: 482000,
    commission: 96400,
    pending: 18200,
    rank: 1,
    status: 'active',
    highRevenue: true,
    topCommission: true,
  },
  {
    id: 'ag02',
    code: '#AG02',
    name: 'Vikram Joshi',
    phone: '+91 98111 22334',
    email: 'vikram@callkaro.in',
    location: 'Delhi, DL',
    joinedAt: '14 Dec 2023',
    lastActive: '12 min ago',
    receivers: 18,
    revenue: 314000,
    commission: 62800,
    pending: 11400,
    rank: 2,
    status: 'active',
    highRevenue: true,
    topCommission: true,
  },
  {
    id: 'ag03',
    code: '#AG03',
    name: 'Amit Tiwari',
    phone: '+91 97654 11223',
    email: 'amit@callkaro.in',
    location: 'Lucknow, UP',
    joinedAt: '3 Jan 2024',
    lastActive: '3 days ago',
    receivers: 11,
    revenue: 178000,
    commission: 35600,
    pending: 6800,
    rank: 4,
    status: 'inactive',
    highRevenue: false,
    topCommission: false,
  },
  {
    id: 'ag04',
    code: '#AG04',
    name: 'Sneha Iyer',
    phone: '+91 99400 55667',
    email: 'sneha@callkaro.in',
    location: 'Chennai, TN',
    joinedAt: '18 Jan 2024',
    lastActive: 'Just now',
    receivers: 21,
    revenue: 268000,
    commission: 53600,
    pending: 9200,
    rank: 3,
    status: 'active',
    highRevenue: true,
    topCommission: true,
  },
  {
    id: 'ag05',
    code: '#AG05',
    name: 'Karan Shah',
    phone: '+91 98250 77889',
    email: 'karan@callkaro.in',
    location: 'Ahmedabad, GJ',
    joinedAt: '2 Feb 2024',
    lastActive: '1 hr ago',
    receivers: 15,
    revenue: 196000,
    commission: 39200,
    pending: 7400,
    rank: 5,
    status: 'active',
    highRevenue: false,
    topCommission: false,
  },
  {
    id: 'ag06',
    code: '#AG06',
    name: 'Neha Kapoor',
    phone: '+91 98123 44556',
    email: 'neha@callkaro.in',
    location: 'Noida, UP',
    joinedAt: '20 Feb 2024',
    lastActive: '8 min ago',
    receivers: 13,
    revenue: 154000,
    commission: 30800,
    pending: 5600,
    rank: 7,
    status: 'active',
    highRevenue: false,
    topCommission: false,
  },
  {
    id: 'ag07',
    code: '#AG07',
    name: 'Arjun Desai',
    phone: '+91 98700 33445',
    email: 'arjun@callkaro.in',
    location: 'Surat, GJ',
    joinedAt: '8 Mar 2024',
    lastActive: '2 days ago',
    receivers: 9,
    revenue: 98000,
    commission: 19600,
    pending: 3200,
    rank: 12,
    status: 'inactive',
    highRevenue: false,
    topCommission: false,
  },
  {
    id: 'ag08',
    code: '#AG08',
    name: 'Pooja Nair',
    phone: '+91 98470 88990',
    email: 'pooja@callkaro.in',
    location: 'Kochi, KL',
    joinedAt: '22 Mar 2024',
    lastActive: '22 min ago',
    receivers: 16,
    revenue: 221000,
    commission: 44200,
    pending: 8100,
    rank: 6,
    status: 'active',
    highRevenue: true,
    topCommission: false,
  },
  {
    id: 'ag09',
    code: '#AG09',
    name: 'Rohan Verma',
    phone: '+91 97111 66778',
    email: 'rohan@callkaro.in',
    location: 'Jaipur, RJ',
    joinedAt: '5 Apr 2024',
    lastActive: '40 min ago',
    receivers: 12,
    revenue: 142000,
    commission: 28400,
    pending: 5100,
    rank: 9,
    status: 'active',
    highRevenue: false,
    topCommission: false,
  },
  {
    id: 'ag10',
    code: '#AG10',
    name: 'Divya Rao',
    phone: '+91 99001 22334',
    email: 'divya@callkaro.in',
    location: 'Hyderabad, TS',
    joinedAt: '19 Apr 2024',
    lastActive: '6 days ago',
    receivers: 8,
    revenue: 86000,
    commission: 17200,
    pending: 2900,
    rank: 15,
    status: 'inactive',
    highRevenue: false,
    topCommission: false,
  },
];

export function getAgentProfile(id: string): AgentProfile | null {
  const base = agents.find(
    a => a.id === id || a.code.toLowerCase() === id.toLowerCase(),
  );
  if (!base) return null;

  return {
    ...base,
    availableBalance: Math.round(base.commission * 0.3),
    team: {
      totalReceivers: base.receivers,
      activeReceivers: Math.max(1, Math.round(base.receivers * 0.75)),
      onlineNow: Math.max(1, Math.round(base.receivers * 0.18)),
      blocked: base.rank === 1 ? 1 : 0,
      inactive: Math.max(0, Math.round(base.receivers * 0.08)),
    },
    commissionDashboard: {
      totalEarned: base.commission,
      pending: base.pending,
      available: Math.round(base.commission * 0.3),
      lifetimeEarnings: Math.round(base.commission * 1.45),
      totalRevenueGenerated: base.revenue,
    },
    revenueAnalytics: {
      totalRevenue: base.revenue,
      avgRevPerReceiver: Math.round(base.revenue / Math.max(1, base.receivers)),
      monthlyRevenue: Math.round(base.revenue * 0.106),
      growthPct: 18 + (base.rank % 20) + base.rank * 0.4,
      revenueRank: base.rank,
    },
    earningsTrend: [
      {month: 'Jan', value: 18000},
      {month: 'Feb', value: 24000},
      {month: 'Mar', value: 31000},
      {month: 'Apr', value: 36000},
      {month: 'May', value: 45000},
      {month: 'Jun', value: 52000},
    ],
    receiverPerformance: [
      {
        id: 'r1',
        name: 'Priya Sharma',
        calls: 832,
        coinsEarned: 45600,
        revenue: 91200,
        commission: 18240,
        status: 'active',
      },
      {
        id: 'r2',
        name: 'Ananya Singh',
        calls: 724,
        coinsEarned: 38200,
        revenue: 76400,
        commission: 15280,
        status: 'active',
      },
      {
        id: 'r3',
        name: 'Kavya Reddy',
        calls: 456,
        coinsEarned: 24100,
        revenue: 48200,
        commission: 9640,
        status: 'inactive',
      },
      {
        id: 'r4',
        name: 'Meera Nair',
        calls: 318,
        coinsEarned: 16400,
        revenue: 32800,
        commission: 6560,
        status: 'active',
      },
    ],
    timeline: [
      {
        id: 't1',
        title: 'Joined the platform',
        detail: base.joinedAt,
        tone: 'pink',
      },
      {
        id: 't2',
        title: 'First receiver onboarded',
        detail: '2 weeks after joining',
        tone: 'amber',
      },
      {
        id: 't3',
        title: 'Reached ₹ 1L commission',
        detail: 'Milestone unlocked',
        tone: 'green',
      },
      {
        id: 't4',
        title: `Ranked #${base.rank} nationally`,
        detail: 'Current standing',
        tone: 'purple',
      },
    ],
  };
}

export function formatInr(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-IN');
}
