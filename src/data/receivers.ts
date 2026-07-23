export type ReceiverStatus = 'active' | 'inactive' | 'blocked';
export type ReceiverPresence = 'online' | 'offline';

export type ReceiverListItem = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  gender: string;
  languages: string[];
  joinedAt: string;
  agentName: string;
  agentCode: string;
  agentCommission: number;
  calls: number;
  coinsEarned: number;
  revenue: number;
  earnings: number;
  rank: number;
  status: ReceiverStatus;
  presence: ReceiverPresence;
  topPerformer: boolean;
};

export type ReceiverWithdrawal = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  settlement: string;
};

export type ReceiverProfile = ReceiverListItem & {
  availableBalance: number;
  withdrawnAmount: number;
  performance: {
    callsThisMonth: number;
    completed: number;
    missed: number;
    onlineHours: number;
  };
  revenueTrend: Array<{month: string; value: number}>;
  withdrawals: ReceiverWithdrawal[];
  compliance: {
    warnings: number;
    violations: number;
    aiFlags: number;
    contactReports: number;
  };
  kyc: {
    receiverId: string;
    submitted: string;
    reviewStatus: 'pending' | 'approved' | 'rejected';
    age: number;
    level: number;
    bio: string;
    photos: string[];
    bank: {
      holderName: string;
      accountNumber: string;
      ifsc: string;
      upiId: string;
    };
    documents: Array<{
      id: string;
      title: string;
      sizeLabel: string;
      thumbnail: string;
    }>;
    videoThumb: string;
  };
};

export const receiversDirectoryStats = {
  totalReceivers: 8241,
  onlineNow: 642,
  offline: 7414,
  blocked: 185,
  totalRevenueLabel: '₹ 1.8Cr',
  earningsPaidLabel: '₹ 72.4L',
  pendingWdLabel: '₹ 8.2L',
};

const photoPool = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-64432c78bfcd?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
];

const docThumb =
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=120&h=160&fit=crop';

export const receivers: ReceiverListItem[] = [
  {
    id: 'rv01',
    code: '#RV01',
    name: 'Priya Sharma',
    phone: '+91 88888 11111',
    email: 'priya.r@callkaro.in',
    location: 'Mumbai, MH',
    gender: 'Female',
    languages: ['Hindi', 'English'],
    joinedAt: '3 Jan 2024',
    agentName: 'Rahul Mehta',
    agentCode: '#AG01',
    agentCommission: 18240,
    calls: 892,
    coinsEarned: 45600,
    revenue: 91200,
    earnings: 36480,
    rank: 1,
    status: 'active',
    presence: 'online',
    topPerformer: true,
  },
  {
    id: 'rv02',
    code: '#RV02',
    name: 'Ananya Patel',
    phone: '+91 88770 22110',
    email: 'ananya.r@callkaro.in',
    location: 'Ahmedabad, GJ',
    gender: 'Female',
    languages: ['Hindi', 'Gujarati', 'English'],
    joinedAt: '12 Jan 2024',
    agentName: 'Rahul Mehta',
    agentCode: '#AG01',
    agentCommission: 12400,
    calls: 710,
    coinsEarned: 38200,
    revenue: 76400,
    earnings: 30560,
    rank: 2,
    status: 'active',
    presence: 'online',
    topPerformer: true,
  },
  {
    id: 'rv03',
    code: '#RV03',
    name: 'Kavya Reddy',
    phone: '+91 90001 33445',
    email: 'kavya.r@callkaro.in',
    location: 'Hyderabad, TS',
    gender: 'Female',
    languages: ['Telugu', 'English'],
    joinedAt: '28 Jan 2024',
    agentName: 'Sneha Iyer',
    agentCode: '#AG04',
    agentCommission: 9800,
    calls: 540,
    coinsEarned: 29100,
    revenue: 58200,
    earnings: 23280,
    rank: 5,
    status: 'active',
    presence: 'offline',
    topPerformer: true,
  },
  {
    id: 'rv04',
    code: '#RV04',
    name: 'Meera Nair',
    phone: '+91 98470 55667',
    email: 'meera.r@callkaro.in',
    location: 'Kochi, KL',
    gender: 'Female',
    languages: ['Malayalam', 'English'],
    joinedAt: '4 Feb 2024',
    agentName: 'Amit Shah',
    agentCode: '#AG02',
    agentCommission: 6400,
    calls: 318,
    coinsEarned: 16400,
    revenue: 32800,
    earnings: 13120,
    rank: 12,
    status: 'inactive',
    presence: 'offline',
    topPerformer: false,
  },
  {
    id: 'rv05',
    code: '#RV05',
    name: 'Isha Verma',
    phone: '+91 98111 77889',
    email: 'isha.r@callkaro.in',
    location: 'Delhi, DL',
    gender: 'Female',
    languages: ['Hindi', 'English'],
    joinedAt: '18 Feb 2024',
    agentName: 'Sneha Iyer',
    agentCode: '#AG04',
    agentCommission: 4200,
    calls: 210,
    coinsEarned: 9800,
    revenue: 19600,
    earnings: 7840,
    rank: 28,
    status: 'blocked',
    presence: 'offline',
    topPerformer: false,
  },
  {
    id: 'rv06',
    code: '#RV06',
    name: 'Sneha Gupta',
    phone: '+91 97654 99001',
    email: 'sneha.r@callkaro.in',
    location: 'Lucknow, UP',
    gender: 'Female',
    languages: ['Hindi'],
    joinedAt: '2 Mar 2024',
    agentName: 'Amit Shah',
    agentCode: '#AG02',
    agentCommission: 11100,
    calls: 620,
    coinsEarned: 33400,
    revenue: 66800,
    earnings: 26720,
    rank: 3,
    status: 'active',
    presence: 'online',
    topPerformer: true,
  },
  {
    id: 'rv07',
    code: '#RV07',
    name: 'Riya Banerjee',
    phone: '+91 98310 11223',
    email: 'riya.r@callkaro.in',
    location: 'Kolkata, WB',
    gender: 'Female',
    languages: ['Bengali', 'Hindi', 'English'],
    joinedAt: '15 Mar 2024',
    agentName: 'Rahul Mehta',
    agentCode: '#AG01',
    agentCommission: 8700,
    calls: 455,
    coinsEarned: 24100,
    revenue: 48200,
    earnings: 19280,
    rank: 8,
    status: 'active',
    presence: 'offline',
    topPerformer: false,
  },
  {
    id: 'rv08',
    code: '#RV08',
    name: 'Neha Joshi',
    phone: '+91 98220 44556',
    email: 'neha.r@callkaro.in',
    location: 'Pune, MH',
    gender: 'Female',
    languages: ['Marathi', 'English'],
    joinedAt: '29 Mar 2024',
    agentName: 'Vikram Rao',
    agentCode: '#AG03',
    agentCommission: 5100,
    calls: 188,
    coinsEarned: 11200,
    revenue: 22400,
    earnings: 8960,
    rank: 35,
    status: 'inactive',
    presence: 'offline',
    topPerformer: false,
  },
  {
    id: 'rv09',
    code: '#RV09',
    name: 'Pooja Malhotra',
    phone: '+91 98123 66778',
    email: 'pooja.r@callkaro.in',
    location: 'Noida, UP',
    gender: 'Female',
    languages: ['Hindi', 'English'],
    joinedAt: '8 Apr 2024',
    agentName: 'Vikram Rao',
    agentCode: '#AG03',
    agentCommission: 7600,
    calls: 390,
    coinsEarned: 20500,
    revenue: 41000,
    earnings: 16400,
    rank: 11,
    status: 'active',
    presence: 'online',
    topPerformer: false,
  },
  {
    id: 'rv10',
    code: '#RV10',
    name: 'Divya Krishnan',
    phone: '+91 99400 88990',
    email: 'divya.r@callkaro.in',
    location: 'Chennai, TN',
    gender: 'Female',
    languages: ['Tamil', 'English'],
    joinedAt: '21 Apr 2024',
    agentName: 'Sneha Iyer',
    agentCode: '#AG04',
    agentCommission: 3900,
    calls: 156,
    coinsEarned: 8400,
    revenue: 16800,
    earnings: 6720,
    rank: 42,
    status: 'blocked',
    presence: 'offline',
    topPerformer: false,
  },
];

export function getReceiverProfile(id: string): ReceiverProfile | null {
  const base = receivers.find(
    r => r.id === id || r.code.toLowerCase() === `#${id}`.toLowerCase() || r.code.toLowerCase() === id.toLowerCase(),
  );
  if (!base) return null;

  return {
    ...base,
    availableBalance: Math.round(base.earnings * 0.34),
    withdrawnAmount: Math.round(base.earnings * 0.66),
    performance: {
      callsThisMonth: Math.round(base.calls * 0.14),
      completed: Math.round(base.calls * 0.12),
      missed: Math.round(base.calls * 0.012),
      onlineHours: 80 + (base.rank % 70),
    },
    revenueTrend: [
      {month: 'Jan', value: 18000},
      {month: 'Feb', value: 24000},
      {month: 'Mar', value: 31000},
      {month: 'Apr', value: 28000},
      {month: 'May', value: 45000},
      {month: 'Jun', value: 58000},
    ],
    withdrawals: [
      {id: 'w1', date: '12 Jun 2024', amount: 8500, status: 'paid', settlement: '14 Jun 2024'},
      {id: 'w2', date: '28 May 2024', amount: 7200, status: 'paid', settlement: '30 May 2024'},
      {id: 'w3', date: '10 May 2024', amount: 6180, status: 'paid', settlement: '12 May 2024'},
      {id: 'w4', date: '02 Jul 2024', amount: 4000, status: 'pending', settlement: '—'},
    ],
    compliance: {
      warnings: 0,
      violations: 0,
      aiFlags: 2,
      contactReports: 0,
    },
    kyc: {
      receiverId: `RCV-${100 + receivers.indexOf(base)}`,
      submitted: '2 hours ago',
      reviewStatus: 'pending',
      age: 22 + (base.rank % 8),
      level: Math.min(5, Math.max(1, 6 - Math.ceil(base.rank / 10))),
      bio: 'Passionate about connecting with people and having meaningful conversations. I enjoy discussing movies, music, travel, and lifestyle topics. Available for friendly chats and companionship.',
      photos: photoPool,
      bank: {
        holderName: base.name,
        accountNumber: '****7890',
        ifsc: 'HDFC0001234',
        upiId: `${base.name.toLowerCase().replace(/\s+/g, '')}@paytm`,
      },
      documents: [
        {id: 'aadhaar', title: 'Aadhaar Card', sizeLabel: '523 kb', thumbnail: docThumb},
        {id: 'pan', title: 'PAN Card', sizeLabel: '412 kb', thumbnail: docThumb},
        {id: 'passbook', title: 'Bank Passbook', sizeLabel: '680 kb', thumbnail: docThumb},
      ],
      videoThumb: photoPool[0],
    },
  };
}

export function formatInr(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-IN');
}
