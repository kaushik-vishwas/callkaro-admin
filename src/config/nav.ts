import type {LucideIcon} from 'lucide-react';
import {
  LayoutDashboard,
  Phone,
  Users,
  Headset,
  ShieldCheck,
  Ticket,
  ArrowLeftRight,   
  Wallet,
  Crown,
  BarChart3,
  ShieldAlert,
  Settings,
  Trophy,
  Package,
  Timer,
  CreditCard,
  Megaphone,
  Gift,
  Sparkles,
} from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  ready?: boolean;
  children?: NavChild[];
};

export type NavChild = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
};

export const adminNavItems: NavItem[] = [
  {id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, ready: true},
  {id: 'callers', label: 'Callers', to: '/callers', icon: Phone, ready: true},
  {
    id: 'receivers',
    label: 'Receivers',
    to: '/receivers',
    icon: Users,
    ready: true,
    children: [
      {
        id: 'top-performers',
        label: 'Top Performers',
        to: '/receivers/top-performers',
        icon: Trophy,
      },
    ],
  },
  {id: 'agents', label: 'Agents', to: '/agents', icon: Headset, ready: true},
  {id: 'verification', label: 'Verification', to: '/verification', icon: ShieldCheck, ready: true},
  {id: 'tickets', label: 'Tickets', to: '/tickets', icon: Ticket, ready: true},
  {id: 'transactions', label: 'Transactions', to: '/transactions', icon: ArrowLeftRight, ready: true},
  {id: 'withdrawals', label: 'Withdrawals', to: '/withdrawals', icon: Wallet, ready: true},
  {id: 'vip', label: 'VIP', to: '/vip', icon: Crown, ready: true},
  {id: 'recharge-packages', label: 'Recharge Packages', to: '/recharge-packages', icon: Package, ready: true},
  {id: 'reward-campaigns', label: 'Recharge Campaigns', to: '/reward-campaigns', icon: Sparkles, ready: true},
  {id: 'gifts', label: 'Gifts', to: '/gifts', icon: Gift, ready: true},
  {id: 'call-rates', label: 'Call Rates', to: '/call-rates', icon: Timer, ready: true},
  {id: 'subscriptions', label: 'Subscriptions', to: '/subscriptions', icon: CreditCard, ready: true},
  {id: 'announcements', label: 'Announcements', to: '/announcements', icon: Megaphone, ready: true},
  {id: 'analytics', label: 'Analytics', to: '/analytics', icon: BarChart3, ready: true},
  {id: 'compliance', label: 'Compliance', to: '/compliance', icon: ShieldAlert, ready: true},
  {id: 'settings', label: 'Settings', to: '/settings', icon: Settings, ready: true},
];
