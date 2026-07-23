export type KpiItem = {
  id: string;
  label: string;
  value: string;
  trend?: 'up' | 'down';
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'pink' | 'amber' | 'green' | 'blue';
};

export type HourBucket = {
  hour: number;
  call: number;
  online: number;
  idle: number;
};

export const dashboardKpisTop: KpiItem[] = [
  {id: 'downloads', label: 'Downloads', value: '2.4M'},
  {id: 'dau', label: 'DAU', value: '142.5K'},
  {id: 'wau', label: 'WAU', value: '840K'},
  {id: 'mau', label: 'MAU', value: '3.12M'},
  {id: 'users', label: 'Total Users', value: '5.24M'},
];

export const dashboardKpisBottom: KpiItem[] = [
  {id: 'receivers', label: 'Receivers', value: '42.8K'},
  {id: 'calls', label: 'Active Calls', value: '8,432'},
  {id: 'pending', label: 'Pending Verif.', value: '1,204'},
  {id: 'revenue', label: 'Revenue', value: '$824.5K', trend: 'up'},
  {id: 'withdrawals', label: 'Withdrawals', value: '$12.4K'},
];

export const revenueSeries = [
  {day: 'Mon', value: 28000},
  {day: 'Tue', value: 22000},
  {day: 'Wed', value: 34000},
  {day: 'Thu', value: 31000},
  {day: 'Fri', value: 42000},
  {day: 'Sat', value: 58000},
  {day: 'Sun', value: 72000},
];

export const activityFeed: ActivityItem[] = [
  {
    id: '1',
    title: 'Priya Kumar',
    detail: 'New user registered',
    time: '2m ago',
    tone: 'pink',
  },
  {
    id: '2',
    title: 'Rahul Singh',
    detail: 'Recharged ₹500',
    time: '3m ago',
    tone: 'amber',
  },
  {
    id: '3',
    title: 'Ananya → Riya',
    detail: 'Call started',
    time: '4m ago',
    tone: 'green',
  },
  {
    id: '4',
    title: 'User #4521',
    detail: 'Report submitted',
    time: '8m ago',
    tone: 'blue',
  },
];

function buildHourly(seed: number, callMax: number, onlineMax: number): HourBucket[] {
  const buckets: HourBucket[] = [];
  for (let hour = 0; hour <= 24; hour += 2) {
    const wave = Math.sin(((hour + seed) / 24) * Math.PI * 2);
    const call = Math.max(0.2, (wave * 0.5 + 0.55) * callMax);
    const online = Math.max(call + 0.4, (wave * 0.45 + 0.7) * onlineMax);
    const idle = Math.max(0.15, online - call);
    buckets.push({
      hour,
      call: Number(call.toFixed(2)),
      online: Number(online.toFixed(2)),
      idle: Number(idle.toFixed(2)),
    });
  }
  return buckets;
}

export const receiverActivity = buildHourly(2, 8.5, 14);
export const callerActivity = buildHourly(5, 1.1, 1.85);
