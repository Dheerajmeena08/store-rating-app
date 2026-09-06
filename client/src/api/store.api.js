import api from './axios';

export const listStores = (params) => api.get('/stores', { params }).then((r) => r.data);
export const submitRating = (storeId, ratingValue) =>
  api.put(`/stores/${storeId}/rating`, { ratingValue }).then((r) => r.data);
