import {useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Download, Eye, Pencil, Plus, Search} from 'lucide-react';
import {DashboardShell} from '../../components/layout/DashboardShell/DashboardShell';
import {StatCard} from '../../components/franchise/StatCard/StatCard';
import {
  FranchiseAccountBadge,
  FranchiseKycBadge,
} from '../../components/franchise/FranchiseBadge/FranchiseBadge';
import {
  FRANCHISES,
  FRANCHISE_STATS,
  type FranchiseAccountStatus,
  type FranchiseKycStatus,
} from '../../data/franchises';
import styles from './FranchisesPage.module.css';

type KycFilter = 'all' | FranchiseKycStatus | FranchiseAccountStatus;

export function FranchisesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<KycFilter>('active');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FRANCHISES.filter(row => {
      const matchesQuery =
        !q ||
        row.businessName.toLowerCase().includes(q) ||
        row.ownerName.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        row.accountStatus === statusFilter ||
        row.kycStatus === statusFilter;

      const created = new Date(row.createdAt).getTime();
      const fromOk = !dateFrom || created >= new Date(dateFrom).getTime();
      const toOk = !dateTo || created <= new Date(dateTo).getTime();

      return matchesQuery && matchesStatus && fromOk && toOk;
    });
  }, [query, statusFilter, dateFrom, dateTo]);

  const stats = FRANCHISE_STATS;

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Franchise Management</h1>
            <p className={styles.subtitle}>Manage and onboard franchises</p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.exportBtn}>
              <Download size={15} />
              Export Data
            </button>
            <button
              type="button"
              className={styles.createBtn}
              onClick={() => navigate('/franchise/create')}
            >
              <Plus size={15} />
              Create Franchise
            </button>
          </div>
        </header>

        <section className={styles.statGrid}>
          <StatCard label="Total Franchises" value={stats.totalFranchises} tone="pink" />
          <StatCard label="Active Franchises" value={stats.activeFranchises} tone="green" />
          <StatCard label="Pending KYC" value={stats.pendingKyc} tone="gold" />
          <StatCard
            label="Rejected Applications"
            value={stats.rejectedApplications}
            tone="red"
          />
          <StatCard
            label="Suspended Franchises"
            value={stats.suspendedFranchises}
            tone="purple"
          />
          <StatCard
            label="Total Revenue"
            value={stats.totalRevenueLabel}
            tone="dark"
          />
        </section>

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search size={16} />
              <input
                type="search"
                placeholder="Search franchise..."
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </label>
            <label className={styles.selectField}>
              <span>KYC Status</span>
              <select
                value={statusFilter}
                onChange={event =>
                  setStatusFilter(event.target.value as KycFilter)
                }
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="under_review">Under Review</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
            <label className={styles.dateField}>
              <span>Date from</span>
              <input
                type="date"
                value={dateFrom}
                onChange={event => setDateFrom(event.target.value)}
              />
            </label>
            <label className={styles.dateField}>
              <span>Date to</span>
              <input
                type="date"
                value={dateTo}
                onChange={event => setDateTo(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Franchise ID</th>
                  <th>Business Name</th>
                  <th>Owner Name</th>
                  <th>City</th>
                  <th>KYC Status</th>
                  <th>Account Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.empty}>
                      No franchises match your filters.
                    </td>
                  </tr>
                ) : null}
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className={styles.code}>{row.code}</td>
                    <td className={styles.strong}>{row.businessName}</td>
                    <td>{row.ownerName}</td>
                    <td>{row.city}</td>
                    <td>
                      <FranchiseKycBadge status={row.kycStatus} />
                    </td>
                    <td>
                      <FranchiseAccountBadge status={row.accountStatus} />
                    </td>
                    <td>{row.createdAt}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link
                          to={`/franchise/${row.id}`}
                          className={styles.iconBtn}
                          aria-label={`View ${row.businessName}`}
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/franchise/${row.id}`}
                          className={styles.iconBtn}
                          aria-label={`Edit ${row.businessName}`}
                        >
                          <Pencil size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
