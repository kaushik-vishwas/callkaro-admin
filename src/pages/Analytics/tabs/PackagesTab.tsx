import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../../api/client';
import {
  fetchAnalyticsPackages,
  type PackageCard,
} from '../../../api/analytics';
import {AnalyticsPanel} from '../AnalyticsPage';
import styles from '../AnalyticsPage.module.css';

type Props = {rangeDays: number};

export function PackagesTab({rangeDays}: Props) {
  const [packages, setPackages] = useState<PackageCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalyticsPackages(rangeDays);
      setPackages(result.packages || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load packages.',
      );
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AnalyticsPanel
      title="Package Economics"
      subtitle="Profitability analysis per recharge package"
    >
      {loading ? <p className={styles.panelSubtitle}>Loading packages…</p> : null}
      {error ? <p className={styles.panelSubtitle}>{error}</p> : null}
      {!loading && !error && packages.length === 0 ? (
        <p className={styles.panelSubtitle}>
          No paid recharge packages in this range.
        </p>
      ) : null}
      <div className={styles.packageGrid}>
        {packages.map(pkg => (
          <article key={pkg.id} className={styles.packageCard}>
            <span className={styles.buyersBadge}>
              {pkg.buyers.toLocaleString('en-IN')} Buyers
            </span>
            <p className={styles.packagePrice}>{pkg.priceLabel}</p>
            <p className={styles.packageCoins}>{pkg.coins}</p>
            <p className={styles.packageRevenue}>{pkg.revenue}</p>
          </article>
        ))}
      </div>
    </AnalyticsPanel>
  );
}
