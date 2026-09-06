import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="container">
      <div className="empty-state">
        <h2>403 — Unauthorized</h2>
        <p>You don't have permission to view this page.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
}
