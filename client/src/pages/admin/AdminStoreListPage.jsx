import { useEffect, useState } from 'react';
import * as adminApi from '../../api/admin.api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormError from '../../components/FormError';
import Toast from '../../components/Toast';
import StarRatingDisplay from '../../components/StarRatingDisplay';
import { validateName, validateAddress, validateEmail } from '../../utils/validators';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  {
    key: 'averageRating',
    label: 'Rating',
    sortable: true,
    render: (row) => <StarRatingDisplay value={row.averageRating} />,
  },
];

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStoreListPage() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  async function fetchStores() {
    const params = { ...filters, sortBy, order };
    const data = await adminApi.listStores(params);
    setRows(data.rows);
  }

  useEffect(() => {
    fetchStores();
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
    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (addressErr) errs.address = addressErr;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreateStore(e) {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = { ...form };
      if (payload.ownerId) payload.ownerId = Number(payload.ownerId);
      else delete payload.ownerId;
      await adminApi.createStore(payload);
      setShowModal(false);
      setForm(emptyForm);
      setToast({ type: 'success', message: 'Store created successfully' });
      fetchStores();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error?.message || 'Failed to create store' });
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Stores</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add Store</button>
      </div>

      <div className="filters">
        <input className="form-control" placeholder="Filter by name" name="name" value={filters.name} onChange={handleFilterChange} />
        <input className="form-control" placeholder="Filter by email" name="email" value={filters.email} onChange={handleFilterChange} />
        <input className="form-control" placeholder="Filter by address" name="address" value={filters.address} onChange={handleFilterChange} />
      </div>

      <div className="card">
        <DataTable columns={columns} rows={rows} sortBy={sortBy} order={order} onSortChange={handleSortChange} />
      </div>

      {showModal && (
        <Modal title="Add New Store" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreateStore}>
            <div className="form-group">
              <label>Store Name</label>
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
              <label>Owner User ID (must have STORE_OWNER role, optional)</label>
              <input className="form-control" name="ownerId" value={form.ownerId} onChange={handleFormChange} />
            </div>
            <button className="btn full" type="submit">Create Store</button>
          </form>
        </Modal>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
