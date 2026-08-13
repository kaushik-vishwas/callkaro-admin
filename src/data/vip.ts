/**
 * Legacy VIP mock data removed — pages now load from `/admin/vip/*`.
 * Keep format helpers re-exported for any leftover imports.
 */
export {
  formatInr,
  formatNumber,
  type VipPeriod,
  type VipPlan,
  type VipPlanStatus,
  type VipUser,
  type VipUserStatus,
  type VipTopUser,
} from '../api/vip';
