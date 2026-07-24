export type VipPeriod = 'weekly' | 'monthly' | 'yearly';
export type VipPlanStatus = 'active' | 'inactive';
export type VipUserStatus = 'active' | 'blocked' | 'suspended';

export type VipPlan = {
  id: string;
  name: string;
  durationDays: number;
  durationLabel: string;
  price: number;
  status: VipPlanStatus;
  popular?: boolean;
  icon: 'bolt' | 'calendar';
};

export type VipTopUser = {
  id: string;
  name: string;
  userId: string;
  amountSpent: number;
  totalCalls: number;
  status: VipUserStatus;
};

export type VipUser = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  age: number;
  location: string;
  regDate: string;
  coins: number;
  totalRecharge: number;
  calls: number;
  vipPlan: string;
  status: VipUserStatus;
  lastActive: string;
  joinDate: string;
  balance: number;
  lastRecharge: string;
  lastWithdrawal: string;
  callSummary: {
    totalCalls: number;
    totalMins: number;
    coinsSpent: number;
    level: string;
  };
  activityStats: {
    totalCalls: number;
    vipCalls: number;
    coinsSpent: number;
    avgDuration: string;
  };
  recentCalls: Array<{
    id: string;
    name: string;
    callType: 'Video' | 'Audio';
    duration: string;
    coins: number;
    dateTime: string;
  }>;
  transactions: Array<{
    id: string;
    date: string;
    type: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
  }>;
};

export const VIP_ANALYTICS = {
  revenue: 24680,
  revenueLabel: '₹24,680',
  activeVipUsers: 2450,
  chartMonthly: [
    {label: 'W1', value: 18200},
    {label: 'W2', value: 22100},
    {label: 'W3', value: 19800},
    {label: 'W4', value: 24680},
    {label: 'W5', value: 21400},
    {label: 'W6', value: 26800},
    {label: 'W7', value: 23900},
    {label: 'W8', value: 28100},
  ],
  chartWeekly: [
    {label: 'Mon', value: 3200},
    {label: 'Tue', value: 4100},
    {label: 'Wed', value: 3800},
    {label: 'Thu', value: 4500},
    {label: 'Fri', value: 5200},
    {label: 'Sat', value: 6100},
    {label: 'Sun', value: 4800},
  ],
  chartYearly: [
    {label: 'Jan', value: 18200},
    {label: 'Feb', value: 20100},
    {label: 'Mar', value: 22400},
    {label: 'Apr', value: 19800},
    {label: 'May', value: 24680},
    {label: 'Jun', value: 26100},
    {label: 'Jul', value: 27800},
    {label: 'Aug', value: 25500},
    {label: 'Sep', value: 28900},
    {label: 'Oct', value: 30100},
    {label: 'Nov', value: 27400},
    {label: 'Dec', value: 31200},
  ],
};

export const VIP_PLAN_STATS = {
  activeVips: 1248,
  monthlyRevenueLabel: '$42,500',
  conversionRate: '18.4%',
};

export const VIP_PLANS: VipPlan[] = [
  {
    id: 'plan-weekly',
    name: 'Weekly VIP',
    durationDays: 7,
    durationLabel: '7 Days',
    price: 24680,
    status: 'active',
    icon: 'bolt',
  },
  {
    id: 'plan-monthly',
    name: 'Monthly VIP',
    durationDays: 30,
    durationLabel: '30 Days',
    price: 24680,
    status: 'active',
    popular: true,
    icon: 'calendar',
  },
  {
    id: 'plan-yearly',
    name: 'Yearly VIP',
    durationDays: 365,
    durationLabel: '365 Days',
    price: 199999,
    status: 'inactive',
    icon: 'calendar',
  },
];

export const VIP_TOP_USERS: VipTopUser[] = [
  {
    id: 'vu-1',
    name: 'Yash',
    userId: '#CK33',
    amountSpent: 12833,
    totalCalls: 407,
    status: 'active',
  },
  {
    id: 'vu-2',
    name: 'Raghav',
    userId: '#CK33',
    amountSpent: 12833,
    totalCalls: 407,
    status: 'active',
  },
  {
    id: 'vu-3',
    name: 'Jagdish',
    userId: '#CK33',
    amountSpent: 12833,
    totalCalls: 407,
    status: 'active',
  },
  {
    id: 'vu-4',
    name: 'Shanaya Kapoor',
    userId: '#CK01',
    amountSpent: 18450,
    totalCalls: 512,
    status: 'active',
  },
  {
    id: 'vu-5',
    name: 'Arjun',
    userId: '#1247',
    amountSpent: 22100,
    totalCalls: 628,
    status: 'active',
  },
];

export const VIP_DIRECTORY_STATS = {
  totalCallers: 24592,
  activeCallers: 18204,
  vipCallers: 3841,
  totalRevenueLabel: '₹ 48.2L',
  avgRevenueLabel: '₹ 1,962',
};

export const VIP_USERS: VipUser[] = [
  {
    id: 'vu-arjun',
    code: '#1247',
    name: 'Arjun',
    phone: '+91 98765 43210',
    email: 'arjun@email.com',
    gender: 'Male',
    age: 28,
    location: 'Mumbai, India',
    regDate: '12 Jan 2025',
    coins: 1240,
    totalRecharge: 18450,
    calls: 128,
    vipPlan: 'Monthly VIP',
    status: 'active',
    lastActive: '3 min ago',
    joinDate: '12 Jan 2025',
    balance: 12450,
    lastRecharge: '₹ 2,000 · 2 days ago',
    lastWithdrawal: '₹ 500 · 1 week ago',
    callSummary: {
      totalCalls: 128,
      totalMins: 1420,
      coinsSpent: 840,
      level: 'Level 2',
    },
    activityStats: {
      totalCalls: 128,
      vipCalls: 46,
      coinsSpent: 840,
      avgDuration: '11m 05s',
    },
    recentCalls: [
      {
        id: 'c1',
        name: 'Priya',
        callType: 'Video',
        duration: '12:40',
        coins: 86,
        dateTime: '10:42 24/10/25',
      },
      {
        id: 'c2',
        name: 'Neha',
        callType: 'Audio',
        duration: '08:15',
        coins: 42,
        dateTime: '18:05 23/10/25',
      },
      {
        id: 'c3',
        name: 'Ananya',
        callType: 'Video',
        duration: '15:20',
        coins: 110,
        dateTime: '21:12 22/10/25',
      },
    ],
    transactions: [
      {
        id: 't1',
        date: '24 Oct 2025',
        type: 'VIP Renewal',
        amount: 999,
        status: 'success',
      },
      {
        id: 't2',
        date: '20 Oct 2025',
        type: 'Coin Purchase',
        amount: 2000,
        status: 'success',
      },
      {
        id: 't3',
        date: '12 Oct 2025',
        type: 'Coin Purchase',
        amount: 500,
        status: 'success',
      },
    ],
  },
  {
    id: 'vu-shanaya',
    code: '#CK01',
    name: 'Shanaya Kapoor',
    phone: '+91 99887 66554',
    email: 'shanaya@email.com',
    gender: 'Female',
    age: 26,
    location: 'Delhi, India',
    regDate: '03 Mar 2025',
    coins: 890,
    totalRecharge: 22100,
    calls: 210,
    vipPlan: 'Weekly VIP',
    status: 'active',
    lastActive: '12 min ago',
    joinDate: '03 Mar 2025',
    balance: 8650,
    lastRecharge: '₹ 1,500 · yesterday',
    lastWithdrawal: '—',
    callSummary: {
      totalCalls: 210,
      totalMins: 1980,
      coinsSpent: 1120,
      level: 'Level 3',
    },
    activityStats: {
      totalCalls: 210,
      vipCalls: 78,
      coinsSpent: 1120,
      avgDuration: '9m 25s',
    },
    recentCalls: [
      {
        id: 'c1',
        name: 'Rohit',
        callType: 'Audio',
        duration: '06:10',
        coins: 28,
        dateTime: '09:15 24/10/25',
      },
    ],
    transactions: [
      {
        id: 't1',
        date: '22 Oct 2025',
        type: 'VIP Renewal',
        amount: 299,
        status: 'success',
      },
    ],
  },
  {
    id: 'vu-yash',
    code: '#CK33',
    name: 'Yash',
    phone: '+91 91234 56789',
    email: 'yash@email.com',
    gender: 'Male',
    age: 31,
    location: 'Pune, India',
    regDate: '18 Feb 2025',
    coins: 640,
    totalRecharge: 12833,
    calls: 407,
    vipPlan: 'Monthly VIP',
    status: 'active',
    lastActive: '1 hr ago',
    joinDate: '18 Feb 2025',
    balance: 5420,
    lastRecharge: '₹ 999 · 4 days ago',
    lastWithdrawal: '₹ 200 · 2 weeks ago',
    callSummary: {
      totalCalls: 407,
      totalMins: 3200,
      coinsSpent: 2100,
      level: 'Level 4',
    },
    activityStats: {
      totalCalls: 407,
      vipCalls: 120,
      coinsSpent: 2100,
      avgDuration: '7m 50s',
    },
    recentCalls: [],
    transactions: [
      {
        id: 't1',
        date: '18 Oct 2025',
        type: 'VIP Renewal',
        amount: 999,
        status: 'success',
      },
    ],
  },
  {
    id: 'vu-raghav',
    code: '#CK44',
    name: 'Raghav',
    phone: '+91 90011 22334',
    email: 'raghav@email.com',
    gender: 'Male',
    age: 29,
    location: 'Jaipur, India',
    regDate: '09 Apr 2025',
    coins: 420,
    totalRecharge: 9800,
    calls: 156,
    vipPlan: 'Weekly VIP',
    status: 'active',
    lastActive: '5 hrs ago',
    joinDate: '09 Apr 2025',
    balance: 3100,
    lastRecharge: '₹ 500 · 6 days ago',
    lastWithdrawal: '—',
    callSummary: {
      totalCalls: 156,
      totalMins: 1100,
      coinsSpent: 640,
      level: 'Level 2',
    },
    activityStats: {
      totalCalls: 156,
      vipCalls: 40,
      coinsSpent: 640,
      avgDuration: '7m 05s',
    },
    recentCalls: [],
    transactions: [],
  },
  {
    id: 'vu-jagdish',
    code: '#CK55',
    name: 'Jagdish',
    phone: '+91 95566 77889',
    email: 'jagdish@email.com',
    gender: 'Male',
    age: 34,
    location: 'Ahmedabad, India',
    regDate: '22 May 2025',
    coins: 210,
    totalRecharge: 6400,
    calls: 98,
    vipPlan: 'Monthly VIP',
    status: 'suspended',
    lastActive: '2 days ago',
    joinDate: '22 May 2025',
    balance: 1200,
    lastRecharge: '₹ 999 · 3 weeks ago',
    lastWithdrawal: '₹ 300 · 1 month ago',
    callSummary: {
      totalCalls: 98,
      totalMins: 780,
      coinsSpent: 410,
      level: 'Level 1',
    },
    activityStats: {
      totalCalls: 98,
      vipCalls: 22,
      coinsSpent: 410,
      avgDuration: '8m 00s',
    },
    recentCalls: [],
    transactions: [],
  },
  {
    id: 'vu-kavya',
    code: '#CK66',
    name: 'Kavya Reddy',
    phone: '+91 97788 11223',
    email: 'kavya@email.com',
    gender: 'Female',
    age: 24,
    location: 'Hyderabad, India',
    regDate: '01 Jun 2025',
    coins: 1550,
    totalRecharge: 15600,
    calls: 188,
    vipPlan: 'Yearly VIP',
    status: 'blocked',
    lastActive: '1 week ago',
    joinDate: '01 Jun 2025',
    balance: 0,
    lastRecharge: '₹ 1,999 · 1 month ago',
    lastWithdrawal: '—',
    callSummary: {
      totalCalls: 188,
      totalMins: 1650,
      coinsSpent: 920,
      level: 'Level 3',
    },
    activityStats: {
      totalCalls: 188,
      vipCalls: 55,
      coinsSpent: 920,
      avgDuration: '8m 45s',
    },
    recentCalls: [],
    transactions: [],
  },
];

export function formatInr(value: number) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export function getVipUserById(id: string) {
  return VIP_USERS.find(user => user.id === id) || null;
}
