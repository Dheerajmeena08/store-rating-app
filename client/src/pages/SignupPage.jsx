import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authApi from '../api/auth.api';
import FormError from '../components/FormError';
import { validateName, validateAddress, validateEmail, validatePassword } from '../utils/validators';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);
    const passwordErr = validatePassword(form.password);
    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (addressErr) errs.address = addressErr;
    if (passwordErr) errs.password = passwordErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.signup(form);
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name (20-60 characters)</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          <FormError message={errors.name} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
          <FormError message={errors.email} />
        </div>
        <div className="form-group">
          <label>Address (max 400 characters)</label>
          <textarea className="form-control" name="address" value={form.address} onChange={handleChange} rows={3} required />
          <FormError message={errors.address} />
        </div>
        <div className="form-group">
          <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
          <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
          <FormError message={errors.password} />
        </div>
        <FormError message={serverError} />
        <button className="btn full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
