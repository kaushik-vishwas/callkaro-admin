export type FranchiseKycStatus =
  | 'verified'
  | 'under_review'
  | 'pending'
  | 'rejected';

export type FranchiseAccountStatus =
  | 'active'
  | 'pending'
  | 'rejected'
  | 'suspended';

export type FranchiseListItem = {
  id: string;
  code: string;
  businessName: string;
  ownerName: string;
  city: string;
  email: string;
  phone: string;
  kycStatus: FranchiseKycStatus;
  accountStatus: FranchiseAccountStatus;
  createdAt: string;
  approvedAt?: string;
  commissionPercent: number;
  pricingCoinsPerMin: number;
  revenue: number;
};

export type FranchiseDocument = {
  id: string;
  title: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadedAt: string;
};

export type FranchiseDetail = FranchiseListItem & {
  bank: {
    bankName: string;
    holderName: string;
    accountNumber: string;
    ifsc: string;
    verified: boolean;
  };
  performance: {
    totalCallers: number;
    totalReceivers: number;
    totalGroups: number;
    revenueGenerated: number;
    commissionEarned: number;
    withdrawals: number;
  };
  operations: {
    activeCallers: number;
    activeReceivers: number;
    suspendedAccounts: number;
    pendingApprovals: number;
  };
  documents: FranchiseDocument[];
};

export type FranchiseStats = {
  totalFranchises: number;
  activeFranchises: number;
  pendingKyc: number;
  rejectedApplications: number;
  suspendedFranchises: number;
  totalRevenue: number;
  totalRevenueLabel: string;
};

export const FRANCHISE_STATS: FranchiseStats = {
  totalFranchises: 35,
  activeFranchises: 28,
  pendingKyc: 4,
  rejectedApplications: 2,
  suspendedFranchises: 1,
  totalRevenue: 12400000,
  totalRevenueLabel: '₹12.4M',
};

export const FRANCHISES: FranchiseDetail[] = [
  {
    id: 'FRH-1024',
    code: 'FRH-1024',
    businessName: 'Delhi Central Hub',
    ownerName: 'Amit Sharma',
    city: 'New Delhi',
    email: 'amit@delhicentral.in',
    phone: '9876543210',
    kycStatus: 'verified',
    accountStatus: 'active',
    createdAt: '2024-01-10',
    approvedAt: '2024-01-15',
    commissionPercent: 10,
    pricingCoinsPerMin: 1000,
    revenue: 2400000,
    bank: {
      bankName: 'HDFC Bank',
      holderName: 'Amit Sharma',
      accountNumber: 'XXXX XXXX XXXX 1234',
      ifsc: 'HDFC0001234',
      verified: true,
    },
    performance: {
      totalCallers: 1284,
      totalReceivers: 2840,
      totalGroups: 142,
      revenueGenerated: 2400000,
      commissionEarned: 240000,
      withdrawals: 180000,
    },
    operations: {
      activeCallers: 1142,
      activeReceivers: 2680,
      suspendedAccounts: 28,
      pendingApprovals: 142,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'verified', uploadedAt: '2024-01-15'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'verified', uploadedAt: '2024-01-15'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'verified',
        uploadedAt: '2024-01-15',
      },
    ],
  },
  {
    id: 'FRH-1025',
    code: 'FRH-1025',
    businessName: 'Mumbai West Hub',
    ownerName: 'Neha Kapoor',
    city: 'Mumbai',
    email: 'neha@mumbaiwest.in',
    phone: '9811122233',
    kycStatus: 'under_review',
    accountStatus: 'pending',
    createdAt: '2024-02-04',
    commissionPercent: 12,
    pricingCoinsPerMin: 1200,
    revenue: 860000,
    bank: {
      bankName: 'ICICI Bank',
      holderName: 'Neha Kapoor',
      accountNumber: 'XXXX XXXX XXXX 8891',
      ifsc: 'ICIC0002211',
      verified: false,
    },
    performance: {
      totalCallers: 420,
      totalReceivers: 910,
      totalGroups: 38,
      revenueGenerated: 860000,
      commissionEarned: 86000,
      withdrawals: 42000,
    },
    operations: {
      activeCallers: 310,
      activeReceivers: 780,
      suspendedAccounts: 6,
      pendingApprovals: 22,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'pending', uploadedAt: '2024-02-04'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'pending', uploadedAt: '2024-02-04'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'pending',
        uploadedAt: '2024-02-04',
      },
    ],
  },
  {
    id: 'FRH-1026',
    code: 'FRH-1026',
    businessName: 'Bengaluru Tech Circle',
    ownerName: 'Rahul Iyer',
    city: 'Bengaluru',
    email: 'rahul@blrtech.in',
    phone: '9900112233',
    kycStatus: 'pending',
    accountStatus: 'pending',
    createdAt: '2024-03-12',
    commissionPercent: 10,
    pricingCoinsPerMin: 1000,
    revenue: 0,
    bank: {
      bankName: 'Axis Bank',
      holderName: 'Rahul Iyer',
      accountNumber: 'XXXX XXXX XXXX 4412',
      ifsc: 'UTIB0003344',
      verified: false,
    },
    performance: {
      totalCallers: 0,
      totalReceivers: 0,
      totalGroups: 0,
      revenueGenerated: 0,
      commissionEarned: 0,
      withdrawals: 0,
    },
    operations: {
      activeCallers: 0,
      activeReceivers: 0,
      suspendedAccounts: 0,
      pendingApprovals: 0,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'pending', uploadedAt: '2024-03-12'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'pending', uploadedAt: '2024-03-12'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'pending',
        uploadedAt: '2024-03-12',
      },
    ],
  },
  {
    id: 'FRH-1027',
    code: 'FRH-1027',
    businessName: 'Hyderabad Pearl Hub',
    ownerName: 'Sana Mirza',
    city: 'Hyderabad',
    email: 'sana@pearlhub.in',
    phone: '9844556677',
    kycStatus: 'rejected',
    accountStatus: 'rejected',
    createdAt: '2024-01-28',
    commissionPercent: 10,
    pricingCoinsPerMin: 900,
    revenue: 120000,
    bank: {
      bankName: 'SBI',
      holderName: 'Sana Mirza',
      accountNumber: 'XXXX XXXX XXXX 7721',
      ifsc: 'SBIN0005566',
      verified: false,
    },
    performance: {
      totalCallers: 88,
      totalReceivers: 140,
      totalGroups: 9,
      revenueGenerated: 120000,
      commissionEarned: 12000,
      withdrawals: 0,
    },
    operations: {
      activeCallers: 0,
      activeReceivers: 0,
      suspendedAccounts: 12,
      pendingApprovals: 0,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'rejected', uploadedAt: '2024-01-28'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'rejected', uploadedAt: '2024-01-28'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'rejected',
        uploadedAt: '2024-01-28',
      },
    ],
  },
  {
    id: 'FRH-1028',
    code: 'FRH-1028',
    businessName: 'Jaipur Heritage Hub',
    ownerName: 'Vikram Singh',
    city: 'Jaipur',
    email: 'vikram@jaipurhub.in',
    phone: '9822001122',
    kycStatus: 'verified',
    accountStatus: 'suspended',
    createdAt: '2023-11-05',
    approvedAt: '2023-11-12',
    commissionPercent: 11,
    pricingCoinsPerMin: 1100,
    revenue: 540000,
    bank: {
      bankName: 'Yes Bank',
      holderName: 'Vikram Singh',
      accountNumber: 'XXXX XXXX XXXX 3390',
      ifsc: 'YESB0001122',
      verified: true,
    },
    performance: {
      totalCallers: 260,
      totalReceivers: 510,
      totalGroups: 21,
      revenueGenerated: 540000,
      commissionEarned: 54000,
      withdrawals: 30000,
    },
    operations: {
      activeCallers: 0,
      activeReceivers: 0,
      suspendedAccounts: 40,
      pendingApprovals: 8,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'verified', uploadedAt: '2023-11-12'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'verified', uploadedAt: '2023-11-12'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'verified',
        uploadedAt: '2023-11-12',
      },
    ],
  },
  {
    id: 'FRH-1029',
    code: 'FRH-1029',
    businessName: 'Chennai South Hub',
    ownerName: 'Priya Nair',
    city: 'Chennai',
    email: 'priya@chennaisouth.in',
    phone: '9888776655',
    kycStatus: 'verified',
    accountStatus: 'active',
    createdAt: '2024-02-20',
    approvedAt: '2024-02-25',
    commissionPercent: 10,
    pricingCoinsPerMin: 1000,
    revenue: 1120000,
    bank: {
      bankName: 'Kotak Mahindra',
      holderName: 'Priya Nair',
      accountNumber: 'XXXX XXXX XXXX 5566',
      ifsc: 'KKBK0009988',
      verified: true,
    },
    performance: {
      totalCallers: 640,
      totalReceivers: 1180,
      totalGroups: 54,
      revenueGenerated: 1120000,
      commissionEarned: 112000,
      withdrawals: 70000,
    },
    operations: {
      activeCallers: 590,
      activeReceivers: 1090,
      suspendedAccounts: 11,
      pendingApprovals: 19,
    },
    documents: [
      {id: 'pan', title: 'PAN Card', status: 'verified', uploadedAt: '2024-02-25'},
      {id: 'aadhaar', title: 'Aadhaar Card', status: 'verified', uploadedAt: '2024-02-25'},
      {
        id: 'cheque',
        title: 'Cancelled Cheque',
        status: 'verified',
        uploadedAt: '2024-02-25',
      },
    ],
  },
];

export function formatInrCompact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}M`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}K`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('en-IN');
}

export function getFranchiseById(id: string) {
  return FRANCHISES.find(item => item.id === id) || null;
}

export function nextFranchiseCode() {
  return 'FRH-XXXXX';
}
