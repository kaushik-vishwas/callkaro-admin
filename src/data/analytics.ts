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
