import type {ReactNode} from 'react';
import {useState} from 'react';
import {Download} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {AnalyticsSubnav} from '../../components/analytics/AnalyticsSubnav/AnalyticsSubnav';
import type {AnalyticsTabId} from '../../data/analytics';
import {OverviewTab} from './tabs/OverviewTab';
import {PackagesTab} from './tabs/PackagesTab';
import {CallersTab} from './tabs/CallersTab';
import {ReceiversTab} from './tabs/ReceiversTab';
import {AgentsTab} from './tabs/AgentsTab';
import {GrossProfitTab} from './tabs/GrossProfitTab';
import {NetProfitTab} from './tabs/NetProfitTab';
import styles from './AnalyticsPage.module.css';

type AnalyticsPageProps = {
  tab: AnalyticsTabId;
};

const titles: Record<
  AnalyticsTabId,
  {title: string; subtitle: string}
> = {
  overview: {
    title: 'Enterprise Dashboard',
    subtitle: "Real-time oversight of Callkaro's global ecosystem.",
  },
  packages: {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
  callers: {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
  receivers: {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
  agents: {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
  'gross-profit': {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
  'net-profit': {
    title: 'Revenue Intelligence',
    subtitle: 'Complete financial control center — trace every ₹ from recharge to profit.',
  },
};

function TabContent({tab}: {tab: AnalyticsTabId}) {
  switch (tab) {
    case 'packages':
      return <PackagesTab />;
    case 'callers':
      return <CallersTab />;
    case 'receivers':
      return <ReceiversTab />;
    case 'agents':
      return <AgentsTab />;
    case 'gross-profit':
      return <GrossProfitTab />;
    case 'net-profit':
      return <NetProfitTab />;
    default:
      return <OverviewTab />;
  }
}

export function AnalyticsPage({tab}: AnalyticsPageProps) {
  const [range, setRange] = useState('30');
  const meta = titles[tab];

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{meta.title}</h1>
            <p className={styles.subtitle}>{meta.subtitle}</p>
          </div>
          <div className={styles.headerActions}>
            <label className={styles.range}>
              <select value={range} onChange={e => setRange(e.target.value)}>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </label>
            <button type="button" className={styles.exportBtn}>
              <Download size={15} />
              Export PDF
            </button>
          </div>
        </header>

        <AnalyticsSubnav />
        <TabContent tab={tab} />
      </div>
    </DashboardShell>
  );
}

export function AnalyticsPanel({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.panelTitle}>{title}</h2>
          {subtitle ? <p className={styles.panelSubtitle}>{subtitle}</p> : null}
        </div>
        {actions ? <div className={styles.panelActions}>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
