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
  status: 'successful' | 'pending' | 'rejected';
};

export type WithdrawalItem = {
  id: string;
  code: string;
  userId: string;
  receiverName: string;
  initials: string;
  amount: number;
  requestDate: string;
  requestDateLabel: string;
  status: WithdrawalStatus;
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
  recentWithdrawals: RecentWithdrawal[];
};

export type WithdrawalStats = {
  totalTransactions: number;
  vipPurchases: number;
  totalRevenue: number;
  totalRevenueLabel: string;
};

export const WITHDRAWAL_STATS: WithdrawalStats = {
  totalTransactions: 12300,
  vipPurchases: 1200,
  totalRevenue: 45230,
  totalRevenueLabel: '₹ 45,230',
};

export const WITHDRAWALS: WithdrawalItem[] = [
  {
    id: 'WD-820104',
    code: 'WD-820104',
    userId: '#CK-12',
    receiverName: 'Shanaya',
    initials: 'SD',
    amount: 24680,
    requestDate: '2026-05-13T08:23:00',
    requestDateLabel: '08:23 13/05/26',
    status: 'pending',
    mobile: '+91 98765 43210',
    level: 'Level 2',
    accountStatus: 'active',
    walletBalance: 12840.45,
    totalEarnings: 45200,
    pendingAmount: 4250,
    prevWithdrawalsLabel: '14 Success',
    bankName: 'HDFC Bank Limited',
    accountHolder: 'Siddharth Das',
    ifsc: 'HDFC0001245',
    accountNumber: '8412 4545 4589 8831',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '12/05/25',
        type: 'Money Withdrawal',
        amount: 2450,
        status: 'successful',
      },
      {
        id: 'rw2',
        date: '28/04/25',
        type: 'Money Withdrawal',
        amount: 5000,
        status: 'successful',
      },
      {
        id: 'rw3',
        date: '10/04/25',
        type: 'Money Withdrawal',
        amount: 1800,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820105',
    code: 'WD-820105',
    userId: '#CK-18',
    receiverName: 'Shreya',
    initials: 'SR',
    amount: 12500,
    requestDate: '2026-05-12T19:40:00',
    requestDateLabel: '19:40 12/05/26',
    status: 'pending',
    mobile: '+91 99887 66554',
    level: 'Level 3',
    accountStatus: 'active',
    walletBalance: 8400,
    totalEarnings: 31200,
    pendingAmount: 12500,
    prevWithdrawalsLabel: '8 Success',
    bankName: 'ICICI Bank',
    accountHolder: 'Shreya Mehta',
    ifsc: 'ICIC0002211',
    accountNumber: '2211 8890 4455 1200',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '01/05/25',
        type: 'Money Withdrawal',
        amount: 3000,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820106',
    code: 'WD-820106',
    userId: '#CK-22',
    receiverName: 'Aasha',
    initials: 'AA',
    amount: 6800,
    requestDate: '2026-05-12T11:05:00',
    requestDateLabel: '11:05 12/05/26',
    status: 'approved',
    mobile: '+91 91234 56780',
    level: 'Level 1',
    accountStatus: 'active',
    walletBalance: 2100.5,
    totalEarnings: 18900,
    pendingAmount: 0,
    prevWithdrawalsLabel: '5 Success',
    bankName: 'SBI',
    accountHolder: 'Aasha Verma',
    ifsc: 'SBIN0003344',
    accountNumber: '3344 1200 9988 4411',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '12/05/26',
        type: 'Money Withdrawal',
        amount: 6800,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820107',
    code: 'WD-820107',
    userId: '#CK-31',
    receiverName: 'Pooja',
    initials: 'PJ',
    amount: 9200,
    requestDate: '2026-05-11T16:22:00',
    requestDateLabel: '16:22 11/05/26',
    status: 'rejected',
    mobile: '+91 90011 22334',
    level: 'Level 2',
    accountStatus: 'active',
    walletBalance: 15600,
    totalEarnings: 27800,
    pendingAmount: 0,
    prevWithdrawalsLabel: '11 Success',
    bankName: 'Axis Bank',
    accountHolder: 'Pooja Sharma',
    ifsc: 'UTIB0005566',
    accountNumber: '5566 7788 9900 1122',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '11/05/26',
        type: 'Money Withdrawal',
        amount: 9200,
        status: 'rejected',
      },
      {
        id: 'rw2',
        date: '20/04/25',
        type: 'Money Withdrawal',
        amount: 2500,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820108',
    code: 'WD-820108',
    userId: '#CK-40',
    receiverName: 'Neha',
    initials: 'NK',
    amount: 4500,
    requestDate: '2026-05-11T09:15:00',
    requestDateLabel: '09:15 11/05/26',
    status: 'pending',
    mobile: '+91 97788 11223',
    level: 'Level 4',
    accountStatus: 'active',
    walletBalance: 22100,
    totalEarnings: 68400,
    pendingAmount: 4500,
    prevWithdrawalsLabel: '22 Success',
    bankName: 'Kotak Mahindra Bank',
    accountHolder: 'Neha Kapoor',
    ifsc: 'KKBK0007788',
    accountNumber: '7788 3344 5566 7788',
    recentWithdrawals: [],
  },
  {
    id: 'WD-820109',
    code: 'WD-820109',
    userId: '#CK-45',
    receiverName: 'Priya',
    initials: 'PS',
    amount: 15000,
    requestDate: '2026-05-10T21:48:00',
    requestDateLabel: '21:48 10/05/26',
    status: 'successful',
    mobile: '+91 95566 77889',
    level: 'Level 3',
    accountStatus: 'active',
    walletBalance: 9800,
    totalEarnings: 41200,
    pendingAmount: 0,
    prevWithdrawalsLabel: '9 Success',
    bankName: 'HDFC Bank Limited',
    accountHolder: 'Priya Singh',
    ifsc: 'HDFC0008899',
    accountNumber: '8899 1122 3344 5566',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '10/05/26',
        type: 'Money Withdrawal',
        amount: 15000,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820110',
    code: 'WD-820110',
    userId: '#CK-52',
    receiverName: 'Ananya',
    initials: 'AP',
    amount: 3200,
    requestDate: '2026-05-10T14:02:00',
    requestDateLabel: '14:02 10/05/26',
    status: 'pending',
    mobile: '+91 93344 55667',
    level: 'Level 1',
    accountStatus: 'suspended',
    walletBalance: 3200,
    totalEarnings: 9800,
    pendingAmount: 3200,
    prevWithdrawalsLabel: '2 Success',
    bankName: 'Yes Bank',
    accountHolder: 'Ananya Patel',
    ifsc: 'YESB0001122',
    accountNumber: '1122 4455 7788 9900',
    recentWithdrawals: [],
  },
  {
    id: 'WD-820111',
    code: 'WD-820111',
    userId: '#CK-61',
    receiverName: 'Kavya',
    initials: 'KR',
    amount: 18750,
    requestDate: '2026-05-09T18:30:00',
    requestDateLabel: '18:30 09/05/26',
    status: 'approved',
    mobile: '+91 91122 33445',
    level: 'Level 5',
    accountStatus: 'active',
    walletBalance: 5400,
    totalEarnings: 92500,
    pendingAmount: 0,
    prevWithdrawalsLabel: '31 Success',
    bankName: 'HDFC Bank Limited',
    accountHolder: 'Kavya Reddy',
    ifsc: 'HDFC0003344',
    accountNumber: '3344 5566 7788 9900',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '09/05/26',
        type: 'Money Withdrawal',
        amount: 18750,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820112',
    code: 'WD-820112',
    userId: '#CK-70',
    receiverName: 'Isha',
    initials: 'IK',
    amount: 5500,
    requestDate: '2026-05-09T08:55:00',
    requestDateLabel: '08:55 09/05/26',
    status: 'pending',
    mobile: '+91 98877 66554',
    level: 'Level 2',
    accountStatus: 'active',
    walletBalance: 11200,
    totalEarnings: 25600,
    pendingAmount: 5500,
    prevWithdrawalsLabel: '6 Success',
    bankName: 'Punjab National Bank',
    accountHolder: 'Isha Kapoor',
    ifsc: 'PUNB0123456',
    accountNumber: '1234 5678 9012 3456',
    recentWithdrawals: [],
  },
  {
    id: 'WD-820113',
    code: 'WD-820113',
    userId: '#CK-77',
    receiverName: 'Meera',
    initials: 'MJ',
    amount: 7800,
    requestDate: '2026-05-08T12:10:00',
    requestDateLabel: '12:10 08/05/26',
    status: 'pending',
    mobile: '+91 96655 44332',
    level: 'Level 2',
    accountStatus: 'active',
    walletBalance: 7600.25,
    totalEarnings: 19800,
    pendingAmount: 7800,
    prevWithdrawalsLabel: '4 Success',
    bankName: 'Bank of Baroda',
    accountHolder: 'Meera Joshi',
    ifsc: 'BARB0ANDHER',
    accountNumber: '9988 7766 5544 3322',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '15/04/25',
        type: 'Money Withdrawal',
        amount: 2000,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820114',
    code: 'WD-820114',
    userId: '#CK-81',
    receiverName: 'Riya',
    initials: 'RN',
    amount: 21000,
    requestDate: '2026-05-07T20:45:00',
    requestDateLabel: '20:45 07/05/26',
    status: 'successful',
    mobile: '+91 94433 22110',
    level: 'Level 4',
    accountStatus: 'active',
    walletBalance: 4300,
    totalEarnings: 71200,
    pendingAmount: 0,
    prevWithdrawalsLabel: '18 Success',
    bankName: 'IDFC First Bank',
    accountHolder: 'Riya Nair',
    ifsc: 'IDFB0044556',
    accountNumber: '4455 6677 8899 0011',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '07/05/26',
        type: 'Money Withdrawal',
        amount: 21000,
        status: 'successful',
      },
    ],
  },
  {
    id: 'WD-820115',
    code: 'WD-820115',
    userId: '#CK-90',
    receiverName: 'Sana',
    initials: 'SD',
    amount: 24680,
    requestDate: '2026-05-06T10:20:00',
    requestDateLabel: '10:20 06/05/26',
    status: 'pending',
    mobile: '+91 98765 00123',
    level: 'Level 2',
    accountStatus: 'active',
    walletBalance: 12840.45,
    totalEarnings: 45200,
    pendingAmount: 4250,
    prevWithdrawalsLabel: '14 Success',
    bankName: 'HDFC Bank Limited',
    accountHolder: 'Siddharth Das',
    ifsc: 'HDFC0001245',
    accountNumber: '8412 4545 4589 8831',
    recentWithdrawals: [
      {
        id: 'rw1',
        date: '12/05/25',
        type: 'Money Withdrawal',
        amount: 2450,
        status: 'successful',
      },
    ],
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

export function getWithdrawalById(id: string) {
  const normalized = id.replace(/^#/, '');
  return (
    WITHDRAWALS.find(
      item => item.id === normalized || item.code === normalized,
    ) || null
  );
}
