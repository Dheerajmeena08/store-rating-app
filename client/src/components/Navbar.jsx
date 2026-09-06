import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Store Rating Platform</Link>
      <div className="links">
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user?.role === 'NORMAL_USER' && <Link to="/stores">Stores</Link>}
        {user?.role === 'STORE_OWNER' && <Link to="/store-owner/dashboard">My Dashboard</Link>}
        {user && <Link to="/update-password">Update Password</Link>}
        {user ? (
          <>
            <span className="badge">{user.role.replace('_', ' ')}</span>
            <button className="btn secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
