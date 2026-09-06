import { useState } from 'react';
import * as authApi from '../api/auth.api';
import FormError from '../components/FormError';
import { validatePassword } from '../utils/validators';

export default function UpdatePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordErr = validatePassword(form.newPassword);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }

    setLoading(true);
    try {
      await authApi.updatePassword(form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="form-page card">
        <h2>Update Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              className="form-control"
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input
              className="form-control"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <FormError message={error} />
          {success && <p style={{ color: 'var(--color-success)', fontSize: 14 }}>{success}</p>}
          <button className="btn full" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
