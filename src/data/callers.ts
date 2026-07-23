export type CallerStatus = 'active' | 'inactive' | 'blocked' | 'suspended';

export type CallerListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  registeredAt: string;
  coins: number;
  totalRecharge: number;
  calls: number;
  vip: boolean;
  status: CallerStatus;
  lastActive: string;
};

export type CallerCallHistory = {
  id: string;
  receiver: string;
  duration: string;
  coins: number;
  status: 'completed' | 'missed' | 'cancelled';
};

export type CallerTimelineItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'pink' | 'amber' | 'green' | 'purple';
};

export type CallerProfile = CallerListItem & {
  wallet: {
    currentBalance: number;
    purchased: number;
    consumed: number;
    bonus: number;
    totalRechargeAmount: number;
  };
  analytics: {
    totalCalls: number;
    completed: number;
    missed: number;
    cancelled: number;
    avgDuration: string;
    totalTalkTime: string;
  };
  weeklyActivity: Array<{day: string; calls: number}>;
  recentCalls: CallerCallHistory[];
  timeline: CallerTimelineItem[];
  ticketsRaised: number;
  reportsSubmitted: number;
};

export const callersDirectoryStats = {
  totalUsers: 24592,
  activeNow: 1804,
  totalCallers: 24592,
  activeCallers: 18204,
  vipCallers: 3841,
  blockedCallers: 412,
  totalRevenueLabel: '₹ 48.2L',
  avgRevenueLabel: '₹ 1,962',
};

export const callers: CallerListItem[] = [
  {
    id: 'ck01',
    code: '#CK01',
    name: 'Shanaya Kapoor',
    phone: '+91 98765 43210',
    email: 'shanaya.k@email.com',
    location: 'Mumbai, MH',
    registeredAt: '12 Jan 2024',
    coins: 4250,
    totalRecharge: 8200,
    calls: 142,
    vip: true,
    status: 'active',
    lastActive: '2 min ago',
  },
  {
    id: 'ck02',
    code: '#CK02',
    name: 'Arjun Mehta',
    phone: '+91 98111 22334',
    email: 'arjun.m@email.com',
    location: 'Delhi, DL',
    registeredAt: '03 Feb 2024',
    coins: 980,
    totalRecharge: 2500,
    calls: 38,
    vip: false,
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'ck03',
    code: '#CK03',
    name: 'Isha Verma',
    phone: '+91 99001 55667',
    email: 'isha.v@email.com',
    location: 'Pune, MH',
    registeredAt: '18 Feb 2024',
    coins: 120,
    totalRecharge: 500,
    calls: 9,
    vip: false,
    status: 'inactive',
    lastActive: '5 days ago',
  },
  {
    id: 'ck04',
    code: '#CK04',
    name: 'Rohan Desai',
    phone: '+91 97654 11223',
    email: 'rohan.d@email.com',
    location: 'Ahmedabad, GJ',
    registeredAt: '01 Mar 2024',
    coins: 0,
    totalRecharge: 1200,
    calls: 21,
    vip: false,
    status: 'blocked',
    lastActive: '12 days ago',
  },
  {
    id: 'ck05',
    code: '#CK05',
    name: 'Ananya Patel',
    phone: '+91 98220 77889',
    email: 'ananya.p@email.com',
    location: 'Bengaluru, KA',
    registeredAt: '11 Mar 2024',
    coins: 6100,
    totalRecharge: 15400,
    calls: 256,
    vip: true,
    status: 'active',
    lastActive: '8 min ago',
  },
  {
    id: 'ck06',
    code: '#CK06',
    name: 'Kabir Singh',
    phone: '+91 99887 66554',
    email: 'kabir.s@email.com',
    location: 'Chandigarh, CH',
    registeredAt: '22 Mar 2024',
    coins: 340,
    totalRecharge: 1800,
    calls: 44,
    vip: false,
    status: 'suspended',
    lastActive: '1 day ago',
  },
  {
    id: 'ck07',
    code: '#CK07',
    name: 'Meera Nair',
    phone: '+91 98470 33445',
    email: 'meera.n@email.com',
    location: 'Kochi, KL',
    registeredAt: '04 Apr 2024',
    coins: 2750,
    totalRecharge: 6400,
    calls: 97,
    vip: true,
    status: 'active',
    lastActive: '14 min ago',
  },
  {
    id: 'ck08',
    code: '#CK08',
    name: 'Dev Sharma',
    phone: '+91 97111 88990',
    email: 'dev.s@email.com',
    location: 'Jaipur, RJ',
    registeredAt: '19 Apr 2024',
    coins: 50,
    totalRecharge: 300,
    calls: 4,
    vip: false,
    status: 'inactive',
    lastActive: '3 weeks ago',
  },
  {
    id: 'ck09',
    code: '#CK09',
    name: 'Sneha Reddy',
    phone: '+91 90001 44556',
    email: 'sneha.r@email.com',
    location: 'Hyderabad, TS',
    registeredAt: '02 May 2024',
    coins: 5120,
    totalRecharge: 11200,
    calls: 188,
    vip: true,
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'ck10',
    code: '#CK10',
    name: 'Vikram Joshi',
    phone: '+91 98700 12121',
    email: 'vikram.j@email.com',
    location: 'Indore, MP',
    registeredAt: '16 May 2024',
    coins: 760,
    totalRecharge: 2100,
    calls: 52,
    vip: false,
    status: 'active',
    lastActive: '32 min ago',
  },
  {
    id: 'ck11',
    code: '#CK11',
    name: 'Pooja Malhotra',
    phone: '+91 98123 66778',
    email: 'pooja.m@email.com',
    location: 'Noida, UP',
    registeredAt: '28 May 2024',
    coins: 0,
    totalRecharge: 900,
    calls: 17,
    vip: false,
    status: 'blocked',
    lastActive: '9 days ago',
  },
  {
    id: 'ck12',
    code: '#CK12',
    name: 'Aditya Rao',
    phone: '+91 99450 22334',
    email: 'aditya.r@email.com',
    location: 'Chennai, TN',
    registeredAt: '07 Jun 2024',
    coins: 1890,
    totalRecharge: 4700,
    calls: 73,
    vip: false,
    status: 'active',
    lastActive: '1 hr ago',
  },
  {
    id: 'ck13',
    code: '#CK13',
    name: 'Nisha Gupta',
    phone: '+91 97555 88991',
    email: 'nisha.g@email.com',
    location: 'Lucknow, UP',
    registeredAt: '21 Jun 2024',
    coins: 420,
    totalRecharge: 1500,
    calls: 29,
    vip: false,
    status: 'suspended',
    lastActive: '2 days ago',
  },
  {
    id: 'ck14',
    code: '#CK14',
    name: 'Harsh Patel',
    phone: '+91 98250 33440',
    email: 'harsh.p@email.com',
    location: 'Surat, GJ',
    registeredAt: '03 Jul 2024',
    coins: 3340,
    totalRecharge: 7800,
    calls: 121,
    vip: true,
    status: 'active',
    lastActive: '6 min ago',
  },
  {
    id: 'ck15',
    code: '#CK15',
    name: 'Riya Banerjee',
    phone: '+91 98310 55667',
    email: 'riya.b@email.com',
    location: 'Kolkata, WB',
    registeredAt: '15 Jul 2024',
    coins: 210,
    totalRecharge: 700,
    calls: 11,
    vip: false,
    status: 'inactive',
    lastActive: '4 days ago',
  },
];

export function getCallerProfile(id: string): CallerProfile | null {
  const base = callers.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  if (!base) return null;

  return {
    ...base,
    wallet: {
      currentBalance: base.coins,
      purchased: Math.round(base.totalRecharge * 1.1),
      consumed: Math.round(base.totalRecharge * 0.65),
      bonus: Math.round(base.coins * 0.12),
      totalRechargeAmount: base.totalRecharge,
    },
    analytics: {
      totalCalls: base.calls,
      completed: Math.round(base.calls * 0.78),
      missed: Math.round(base.calls * 0.14),
      cancelled: Math.round(base.calls * 0.08),
      avgDuration: '4m 18s',
      totalTalkTime: `${Math.max(1, Math.round(base.calls * 0.07))}h ${12 + (base.calls % 40)}m`,
    },
    weeklyActivity: [
      {day: 'Mon', calls: 12},
      {day: 'Tue', calls: 18},
      {day: 'Wed', calls: 9},
      {day: 'Thu', calls: 22},
      {day: 'Fri', calls: 28},
      {day: 'Sat', calls: 31},
      {day: 'Sun', calls: 16},
    ],
    recentCalls: [
      {id: '1', receiver: 'Priya Sharma', duration: '8m 12s', coins: 96, status: 'completed'},
      {id: '2', receiver: 'Ananya Patel', duration: '3m 40s', coins: 44, status: 'completed'},
      {id: '3', receiver: 'Kavya Reddy', duration: '0m 00s', coins: 0, status: 'missed'},
      {id: '4', receiver: 'Meera Nair', duration: '5m 05s', coins: 60, status: 'completed'},
      {id: '5', receiver: 'Isha Verma', duration: '1m 10s', coins: 14, status: 'cancelled'},
    ],
    timeline: [
      {
        id: 't1',
        title: 'Account registered',
        detail: base.registeredAt,
        time: base.registeredAt,
        tone: 'pink',
      },
      {
        id: 't2',
        title: 'First recharge ₹ 500',
        detail: 'Wallet funded',
        time: '2 days later',
        tone: 'amber',
      },
      {
        id: 't3',
        title: 'VIP activated',
        detail: base.vip ? 'Membership live' : 'Not activated',
        time: '1 week later',
        tone: 'purple',
      },
      {
        id: 't4',
        title: '100th call completed',
        detail: 'Milestone reached',
        time: 'Recently',
        tone: 'green',
      },
    ],
    ticketsRaised: 3,
    reportsSubmitted: 0,
  };
}

export function formatInr(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-IN');
}
