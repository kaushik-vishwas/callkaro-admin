export type TicketUserType = 'caller' | 'receiver' | 'agent';
export type TicketStatus = 'open' | 'resolved';

export type TicketAttachment = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf';
  sizeLabel: string;
};

export type TicketItem = {
  id: string;
  code: string;
  reportBy: string;
  reportById: string;
  reportTo: string;
  reportToId: string;
  issueType: string;
  categories: string[];
  status: TicketStatus;
  userType: TicketUserType;
  createdAt: string;
  createdLabel: string;
  description: string;
  assignedToAdmin: boolean;
  attachments: TicketAttachment[];
};

export type TicketStats = {
  total: number;
  open: number;
  resolved: number;
};

export const TICKET_STATS: TicketStats = {
  total: 1248,
  open: 185,
  resolved: 950,
};

export const TICKETS: TicketItem[] = [
  {
    id: 'TK-1031',
    code: '#TK-1031',
    reportBy: 'Yash',
    reportById: 'CK1001',
    reportTo: 'Sarah Jenkins',
    reportToId: 'CK1102',
    issueType: 'Harassment',
    categories: ['Harassment', 'Other'],
    status: 'open',
    userType: 'caller',
    createdAt: '2024-10-24T08:41:00',
    createdLabel: 'Oct 24, 08:41 AM',
    description:
      'The user reported an issue regarding harassment on the platform. This requires immediate attention and review of call records.',
    assignedToAdmin: true,
    attachments: [
      {id: 'a1', name: 'screenshot.png', type: 'image', sizeLabel: '240 KB'},
      {id: 'a2', name: 'clip.mp4', type: 'video', sizeLabel: '2.1 MB'},
      {id: 'a3', name: 'report.pdf', type: 'pdf', sizeLabel: '180 KB'},
    ],
  },
  {
    id: 'TK-1002',
    code: '#TK-1002',
    reportBy: 'Amar',
    reportById: 'CK1010',
    reportTo: 'Marcus Reed',
    reportToId: 'AG-204',
    issueType: 'Misuse',
    categories: ['Misuse'],
    status: 'resolved',
    userType: 'agent',
    createdAt: '2024-10-23T11:20:00',
    createdLabel: 'Oct 23, 11:20 AM',
    description:
      'Agent reported misuse of referral links by a caller account.',
    assignedToAdmin: true,
    attachments: [
      {id: 'b1', name: 'evidence.pdf', type: 'pdf', sizeLabel: '95 KB'},
    ],
  },
  {
    id: 'TK-1032',
    code: '#TK-1032',
    reportBy: 'Priya Sharma',
    reportById: 'RCV-100',
    reportTo: 'Rohit Mehta',
    reportToId: 'CK1201',
    issueType: 'Payment Failure',
    categories: ['Payment Failure'],
    status: 'resolved',
    userType: 'receiver',
    createdAt: '2024-10-22T16:05:00',
    createdLabel: 'Oct 22, 04:05 PM',
    description:
      'Receiver reported a payout failure for last week settlement.',
    assignedToAdmin: false,
    attachments: [
      {id: 'c1', name: 'bank-slip.png', type: 'image', sizeLabel: '310 KB'},
    ],
  },
  {
    id: 'TK-1038',
    code: '#TK-1038',
    reportBy: 'Ananya Patel',
    reportById: 'RCV-SAMPLE2',
    reportTo: 'Support Queue',
    reportToId: 'SYS',
    issueType: 'Harassment',
    categories: ['Harassment'],
    status: 'open',
    userType: 'receiver',
    createdAt: '2024-10-24T09:12:00',
    createdLabel: 'Oct 24, 09:12 AM',
    description:
      'Receiver reported abusive messages during a call and asked for account review.',
    assignedToAdmin: true,
    attachments: [
      {id: 'd1', name: 'chat.png', type: 'image', sizeLabel: '128 KB'},
      {id: 'd2', name: 'recording.mp4', type: 'video', sizeLabel: '4.4 MB'},
    ],
  },
  {
    id: 'TK-1001',
    code: '#TK-1001',
    reportBy: 'Yash',
    reportById: 'CK1001',
    reportTo: 'Sarah Jenkins',
    reportToId: 'CK1102',
    issueType: 'Harassment',
    categories: ['Harassment', 'Other'],
    status: 'open',
    userType: 'caller',
    createdAt: '2024-10-24T09:41:00',
    createdLabel: 'Oct 24, 09:41 AM',
    description:
      'The user reported an issue regarding harassment on the platform. This requires immediate attention and review of call records.',
    assignedToAdmin: true,
    attachments: [
      {id: 'e1', name: 'screenshot.png', type: 'image', sizeLabel: '240 KB'},
      {id: 'e2', name: 'clip.mp4', type: 'video', sizeLabel: '2.1 MB'},
      {id: 'e3', name: 'report.pdf', type: 'pdf', sizeLabel: '180 KB'},
    ],
  },
  {
    id: 'TK-1040',
    code: '#TK-1040',
    reportBy: 'Neha Kapoor',
    reportById: 'AG-118',
    reportTo: 'Delhi Central Hub',
    reportToId: 'FRH-1024',
    issueType: 'Misuse',
    categories: ['Misuse', 'Other'],
    status: 'open',
    userType: 'agent',
    createdAt: '2024-10-21T14:30:00',
    createdLabel: 'Oct 21, 02:30 PM',
    description: 'Agent flagged repeated spam call attempts from a caller.',
    assignedToAdmin: false,
    attachments: [],
  },
  {
    id: 'TK-1041',
    code: '#TK-1041',
    reportBy: 'Kavya Reddy',
    reportById: 'RCV-SAMPLE3',
    reportTo: 'Admin Team',
    reportToId: 'ADMIN',
    issueType: 'Payment Failure',
    categories: ['Payment Failure'],
    status: 'resolved',
    userType: 'receiver',
    createdAt: '2024-10-20T10:00:00',
    createdLabel: 'Oct 20, 10:00 AM',
    description: 'Payout retry succeeded after bank verification update.',
    assignedToAdmin: true,
    attachments: [
      {id: 'f1', name: 'receipt.pdf', type: 'pdf', sizeLabel: '64 KB'},
    ],
  },
  {
    id: 'TK-1042',
    code: '#TK-1042',
    reportBy: 'Vikram',
    reportById: 'CK1300',
    reportTo: 'Isha Kapoor',
    reportToId: 'RCV-220',
    issueType: 'Misuse',
    categories: ['Misuse'],
    status: 'open',
    userType: 'caller',
    createdAt: '2024-10-19T18:22:00',
    createdLabel: 'Oct 19, 06:22 PM',
    description: 'Caller reported profile content misuse by a receiver.',
    assignedToAdmin: true,
    attachments: [
      {id: 'g1', name: 'profile.png', type: 'image', sizeLabel: '190 KB'},
    ],
  },
];

export function getTicketById(id: string) {
  const normalized = id.replace(/^#/, '');
  return (
    TICKETS.find(
      ticket => ticket.id === normalized || ticket.code === `#${normalized}`,
    ) || null
  );
}
