import { useEffect, useState } from 'react';
import * as storeOwnerApi from '../../api/storeOwner.api';
import StarRatingDisplay from '../../components/StarRatingDisplay';

export default function StoreOwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    storeOwnerApi
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.error?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <div className="container"><p className="form-error">{error}</p></div>;
  if (!data) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{data.store.name}</h2>
      <p style={{ color: '#6b716e' }}>{data.store.address}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="value"><StarRatingDisplay value={data.averageRating} /></div>
          <div className="label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.totalRatings}</div>
          <div className="label">Total Ratings</div>
        </div>
      </div>

      <h3>Users who rated your store</h3>
      {data.raters.length === 0 ? (
        <div className="empty-state">No ratings submitted yet.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.ratingId}>
                  <td>{r.user.name}</td>
                  <td>{r.user.email}</td>
                  <td><StarRatingDisplay value={r.ratingValue} /></td>
                  <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
