import type {AgentStatus} from '../../../data/agents';
import styles from './AgentStatusBadge.module.css';

const labels: Record<AgentStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

export function AgentStatusBadge({status}: {status: AgentStatus}) {
  return (
    <span className={[styles.badge, styles[status]].join(' ')}>
      {labels[status]}
    </span>
  );
}
