import { useEffect, useState } from 'react';
import * as storeApi from '../../api/store.api';
import StarRatingDisplay from '../../components/StarRatingDisplay';
import StarRatingInput from '../../components/StarRatingInput';
import Toast from '../../components/Toast';

export default function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [toast, setToast] = useState(null);
  const [savingId, setSavingId] = useState(null);

  async function fetchStores() {
    const data = await storeApi.listStores(search);
    setStores(data.stores);
  }

  useEffect(() => {
    fetchStores();
  }, [search]);

  function handleSearchChange(e) {
    setSearch({ ...search, [e.target.name]: e.target.value });
  }

  async function handleRate(storeId, ratingValue) {
    setSavingId(storeId);
    try {
      await storeApi.submitRating(storeId, ratingValue);
      setToast({ type: 'success', message: 'Rating saved' });
      fetchStores();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error?.message || 'Failed to save rating' });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="container">
      <h2>Browse Stores</h2>

      <div className="filters">
        <input
          className="form-control"
          placeholder="Search by name"
          name="name"
          value={search.name}
          onChange={handleSearchChange}
        />
        <input
          className="form-control"
          placeholder="Search by address"
          name="address"
          value={search.address}
          onChange={handleSearchChange}
        />
      </div>

      {stores.length === 0 ? (
        <div className="empty-state">No stores match your search.</div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3 style={{ marginTop: 0 }}>{store.name}</h3>
              <p style={{ color: '#6b716e', fontSize: 14 }}>{store.address}</p>
              <p>
                <strong>Overall:</strong> <StarRatingDisplay value={store.overallRating} />
              </p>
              <p>
                <strong>Your rating:</strong>{' '}
                {store.myRating ? <StarRatingDisplay value={store.myRating} /> : <em>Not rated yet</em>}
              </p>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600 }}>
                  {store.myRating ? 'Update your rating:' : 'Submit a rating:'}
                </label>
                <StarRatingInput
                  value={store.myRating || 0}
                  onChange={(val) => handleRate(store.id, val)}
                />
                {savingId === store.id && <span style={{ fontSize: 12, color: '#6b716e' }}> Saving...</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
