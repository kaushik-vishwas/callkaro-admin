import {PACKAGES} from '../../../data/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

export function PackagesTab() {
  return (
    <AnalyticsPanel
      title="Package Economics"
      subtitle="Profitability analysis per recharge package"
    >
      <div className={styles.packageGrid}>
        {PACKAGES.map(pkg => (
          <article key={pkg.id} className={styles.packageCard}>
            <span className={styles.buyersBadge}>{pkg.buyers.toLocaleString('en-IN')} Buyers</span>
            <p className={styles.packagePrice}>{pkg.priceLabel}</p>
            <p className={styles.packageCoins}>{pkg.coins}</p>
            <p className={styles.packageRevenue}>{pkg.revenue}</p>
          </article>
        ))}
      </div>
    </AnalyticsPanel>
  );
}
