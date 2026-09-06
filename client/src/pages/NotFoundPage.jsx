import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="empty-state">
        <h2>404 — Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
}
