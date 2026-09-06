import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as adminApi from '../../api/admin.api';
import StarRatingDisplay from '../../components/StarRatingDisplay';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getUserDetail(id)
      .then((data) => setUser(data.user))
      .catch((err) => setError(err.response?.data?.error?.message || 'Failed to load user'));
  }, [id]);

  if (error) return <div className="container"><p className="form-error">{error}</p></div>;
  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <Link to="/admin/users">&larr; Back to Users</Link>
      <div className="card" style={{ marginTop: 16, maxWidth: 480 }}>
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> <span className="badge">{user.role.replace('_', ' ')}</span></p>
        {user.role === 'STORE_OWNER' && (
          <p>
            <strong>Store Rating:</strong>{' '}
            <StarRatingDisplay value={user.rating} />
          </p>
        )}
      </div>
    </div>
  );
}
