import type {DashboardRange} from '../../../api/dashboard';
import styles from './RangeFilter.module.css';

export const DASHBOARD_RANGES: {days: DashboardRange; label: string}[] = [
  {days: 1, label: 'Today'},
  {days: 7, label: 'Last 7 Days'},
  {days: 30, label: 'Last 30 Days'},
  {days: 90, label: 'Last 90 Days'},
];

type Props = {
  value: DashboardRange;
  onChange: (days: DashboardRange) => void;
  loading?: boolean;
  label?: string;
};

export function RangeFilter({value, onChange, loading, label}: Props) {
  return (
    <div className={styles.wrap} aria-busy={loading || undefined}>
      <select
        className={styles.select}
        aria-label={label || 'Date range'}
        value={value}
        onChange={e => onChange(Number(e.target.value) as DashboardRange)}>
        {DASHBOARD_RANGES.map(item => (
          <option key={item.days} value={item.days}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
