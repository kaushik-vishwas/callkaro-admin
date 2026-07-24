import {Navigate, useParams} from 'react-router-dom';
import {resolveAnalyticsTab} from '../../data/analytics';
import {AnalyticsPage} from './AnalyticsPage';

export function AnalyticsRoute() {
  const {tab} = useParams();
  if (tab && !['packages', 'callers', 'receivers', 'agents', 'gross-profit', 'net-profit'].includes(tab)) {
    return <Navigate to="/analytics" replace />;
  }
  return <AnalyticsPage tab={resolveAnalyticsTab(tab)} />;
}
