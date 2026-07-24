export type TransactionType = 'UPI' | 'Card' | 'Wallet' | 'VIP' | 'NetBanking';
export type TransactionStatus = 'successful' | 'failed' | 'pending';

export type TransactionItem = {
  id: string;
  code: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  coins: number;
  dateTime: string;
  dateTimeLabel: string;
  status: TransactionStatus;
  ipAddress: string;
  paymentMethod: string;
  gatewayId: string;
  category: string;
};

export type TransactionStats = {
  totalTransactions: number;
  vipPurchases: number;
  totalRevenue: number;
  totalRevenueLabel: string;
};

export const TRANSACTION_STATS: TransactionStats = {
  totalTransactions: 12300,
  vipPurchases: 1200,
  totalRevenue: 45230,
  totalRevenueLabel: '₹ 45,230',
};

export const TRANSACTIONS: TransactionItem[] = [
  {
    id: 'TRX-948271',
    code: '#TRX-948271',
    userId: '#CK-12',
    userName: 'Raj',
    type: 'UPI',
    amount: 24680,
    coins: 238,
    dateTime: '2026-05-13T08:23:00',
    dateTimeLabel: '08:23 13/05/26',
    status: 'successful',
    ipAddress: '123.82.782.36',
    paymentMethod: 'UPI · success@oksbi',
    gatewayId: 'pay_3N8zx_9281',
    category: 'Payment',
  },
  {
    id: 'TRX-948272',
    code: '#TRX-948272',
    userId: 'USR-102',
    userName: 'Alex Rivera',
    type: 'Card',
    amount: 254.5,
    coins: 1245,
    dateTime: '2023-10-24T10:42:00',
    dateTimeLabel: '10:42 24/10/23',
    status: 'successful',
    ipAddress: '123.82.782.36',
    paymentMethod: 'Visa **** 4242',
    gatewayId: 'ch_3N8zx_9281',
    category: 'Payment',
  },
  {
    id: 'TRX-948273',
    code: '#TRX-948273',
    userId: '#CK-45',
    userName: 'Priya Sharma',
    type: 'VIP',
    amount: 999,
    coins: 0,
    dateTime: '2026-05-12T19:10:00',
    dateTimeLabel: '19:10 12/05/26',
    status: 'successful',
    ipAddress: '49.36.112.88',
    paymentMethod: 'UPI · priya@ybl',
    gatewayId: 'pay_vip_8812',
    category: 'VIP Purchase',
  },
  {
    id: 'TRX-948274',
    code: '#TRX-948274',
    userId: '#CK-88',
    userName: 'Amit Verma',
    type: 'Wallet',
    amount: 500,
    coins: 520,
    dateTime: '2026-05-12T14:05:00',
    dateTimeLabel: '14:05 12/05/26',
    status: 'pending',
    ipAddress: '103.21.244.12',
    paymentMethod: 'Wallet Balance',
    gatewayId: 'wal_5521',
    category: 'Payment',
  },
  {
    id: 'TRX-948275',
    code: '#TRX-948275',
    userId: '#CK-19',
    userName: 'Neha Kapoor',
    type: 'NetBanking',
    amount: 1500,
    coins: 1600,
    dateTime: '2026-05-11T11:40:00',
    dateTimeLabel: '11:40 11/05/26',
    status: 'failed',
    ipAddress: '27.59.201.44',
    paymentMethod: 'HDFC NetBanking',
    gatewayId: 'nb_9921',
    category: 'Payment',
  },
  {
    id: 'TRX-948276',
    code: '#TRX-948276',
    userId: '#CK-33',
    userName: 'Rohit Mehta',
    type: 'UPI',
    amount: 299,
    coins: 300,
    dateTime: '2026-05-11T09:15:00',
    dateTimeLabel: '09:15 11/05/26',
    status: 'successful',
    ipAddress: '122.168.10.5',
    paymentMethod: 'UPI · rohit@okaxis',
    gatewayId: 'pay_4410',
    category: 'Payment',
  },
  {
    id: 'TRX-948277',
    code: '#TRX-948277',
    userId: '#CK-71',
    userName: 'Sana Mirza',
    type: 'VIP',
    amount: 1999,
    coins: 0,
    dateTime: '2026-05-10T21:22:00',
    dateTimeLabel: '21:22 10/05/26',
    status: 'successful',
    ipAddress: '14.139.241.90',
    paymentMethod: 'Card **** 8891',
    gatewayId: 'ch_vip_2201',
    category: 'VIP Purchase',
  },
  {
    id: 'TRX-948278',
    code: '#TRX-948278',
    userId: '#CK-02',
    userName: 'Vikram Singh',
    type: 'Card',
    amount: 120,
    coins: 125,
    dateTime: '2026-05-10T08:01:00',
    dateTimeLabel: '08:01 10/05/26',
    status: 'successful',
    ipAddress: '180.211.99.17',
    paymentMethod: 'Mastercard **** 5512',
    gatewayId: 'ch_7712',
    category: 'Payment',
  },
  {
    id: 'TRX-948279',
    code: '#TRX-948279',
    userId: '#CK-56',
    userName: 'Kavya Reddy',
    type: 'UPI',
    amount: 780,
    coins: 800,
    dateTime: '2026-05-09T16:48:00',
    dateTimeLabel: '16:48 09/05/26',
    status: 'successful',
    ipAddress: '117.198.44.2',
    paymentMethod: 'UPI · kavya@paytm',
    gatewayId: 'pay_6633',
    category: 'Payment',
  },
  {
    id: 'TRX-948280',
    code: '#TRX-948280',
    userId: '#CK-90',
    userName: 'Ananya Patel',
    type: 'Wallet',
    amount: 50,
    coins: 55,
    dateTime: '2026-05-09T12:30:00',
    dateTimeLabel: '12:30 09/05/26',
    status: 'successful',
    ipAddress: '49.205.88.11',
    paymentMethod: 'Wallet Balance',
    gatewayId: 'wal_1102',
    category: 'Payment',
  },
  {
    id: 'TRX-948281',
    code: '#TRX-948281',
    userId: '#CK-14',
    userName: 'Yash',
    type: 'UPI',
    amount: 450,
    coins: 470,
    dateTime: '2026-05-08T18:05:00',
    dateTimeLabel: '18:05 08/05/26',
    status: 'pending',
    ipAddress: '103.88.20.9',
    paymentMethod: 'UPI · yash@oksbi',
    gatewayId: 'pay_8890',
    category: 'Payment',
  },
  {
    id: 'TRX-948282',
    code: '#TRX-948282',
    userId: '#CK-27',
    userName: 'Isha Kapoor',
    type: 'VIP',
    amount: 499,
    coins: 0,
    dateTime: '2026-05-08T07:55:00',
    dateTimeLabel: '07:55 08/05/26',
    status: 'successful',
    ipAddress: '59.144.12.77',
    paymentMethod: 'UPI · isha@ybl',
    gatewayId: 'pay_vip_441',
    category: 'VIP Purchase',
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

export function getTransactionById(id: string) {
  const normalized = id.replace(/^#/, '');
  return (
    TRANSACTIONS.find(
      item => item.id === normalized || item.code === `#${normalized}`,
    ) || null
  );
}
