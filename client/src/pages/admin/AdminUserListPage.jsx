import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/admin.api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormError from '../../components/FormError';
import Toast from '../../components/Toast';
import { validateName, validateAddress, validateEmail, validatePassword } from '../../utils/validators';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'actions',
    label: '',
    render: (row) => <Link to={`/admin/users/${row.id}`}>View</Link>,
  },
];

const emptyForm = { name: '', email: '', address: '', password: '', role: 'NORMAL_USER' };

export default function AdminUserListPage() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  async function fetchUsers() {
    const params = { ...filters, sortBy, order };
    const data = await adminApi.listUsers(params);
    setRows(data.rows);
  }

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSortChange(key, nextOrder) {
    setSortBy(key);
    setOrder(nextOrder);
  }

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const errs = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);
    const passwordErr = validatePassword(form.password);
    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (addressErr) errs.address = addressErr;
    if (passwordErr) errs.password = passwordErr;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await adminApi.createUser(form);
      setShowModal(false);
      setForm(emptyForm);
      setToast({ type: 'success', message: 'User created successfully' });
      fetchUsers();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error?.message || 'Failed to create user' });
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="filters">
        <input className="form-control" placeholder="Filter by name" name="name" value={filters.name} onChange={handleFilterChange} />
        <input className="form-control" placeholder="Filter by email" name="email" value={filters.email} onChange={handleFilterChange} />
        <input className="form-control" placeholder="Filter by address" name="address" value={filters.address} onChange={handleFilterChange} />
        <select className="form-control" name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <div className="card">
        <DataTable columns={columns} rows={rows} sortBy={sortBy} order={order} onSortChange={handleSortChange} />
      </div>

      {showModal && (
        <Modal title="Add New User" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleFormChange} required />
              <FormError message={formErrors.name} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleFormChange} required />
              <FormError message={formErrors.email} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" name="address" value={form.address} onChange={handleFormChange} rows={2} required />
              <FormError message={formErrors.address} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleFormChange} required />
              <FormError message={formErrors.password} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="form-control" name="role" value={form.role} onChange={handleFormChange}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
            <button className="btn full" type="submit">Create User</button>
          </form>
        </Modal>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
