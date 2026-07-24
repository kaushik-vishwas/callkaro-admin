import type {LucideIcon} from 'lucide-react';
import {
  LayoutDashboard,
  Phone,
  Users,
  Headset,
  Store,
  ShieldCheck,
  Ticket,
  ArrowLeftRight,
  Wallet,
  Crown,
  BarChart3,
  Settings,
} from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  ready?: boolean;
};

export const adminNavItems: NavItem[] = [
  {id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, ready: true},
  {id: 'callers', label: 'Callers', to: '/callers', icon: Phone, ready: true},
  {id: 'receivers', label: 'Receivers', to: '/receivers', icon: Users, ready: true},
  {id: 'agents', label: 'Agents', to: '/agents', icon: Headset, ready: true},
  {id: 'franchise', label: 'Franchise', to: '/franchise', icon: Store, ready: true},
  {id: 'verification', label: 'Verification', to: '/verification', icon: ShieldCheck, ready: true},
  {id: 'tickets', label: 'Tickets', to: '/tickets', icon: Ticket, ready: true},
  {id: 'transactions', label: 'Transactions', to: '/transactions', icon: ArrowLeftRight, ready: true},
  {id: 'withdrawals', label: 'Withdrawals', to: '/withdrawals', icon: Wallet, ready: true},
  {id: 'vip', label: 'VIP', to: '/vip', icon: Crown, ready: true},
  {id: 'analytics', label: 'Analytics', to: '/analytics', icon: BarChart3, ready: true},
  {id: 'settings', label: 'Settings', to: '/settings', icon: Settings, ready: true},
];
