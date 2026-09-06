import { useEffect, useState } from 'react';
import * as adminApi from '../../api/admin.api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.error?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {error && <p className="form-error">{error}</p>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="value">{stats.totalUsers}</div>
            <div className="label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="value">{stats.totalStores}</div>
            <div className="label">Total Stores</div>
          </div>
          <div className="stat-card">
            <div className="value">{stats.totalRatings}</div>
            <div className="label">Total Ratings</div>
          </div>
        </div>
      )}
    </div>
  );
}
