const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');

async function listStoresForUser({ name, address, userId }) {
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  const stores = await Store.findAll({
    where,
    include: [{ model: Rating, as: 'ratings' }],
    order: [['name', 'ASC']],
  });

  return stores.map((store) => {
    const plain = store.toJSON();
    const ratings = plain.ratings || [];
    const overallRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length).toFixed(2)
      : null;

    const ownRating = userId
      ? ratings.find((r) => r.user_id === Number(userId))?.rating_value ?? null
      : null;

    delete plain.ratings;
    return { ...plain, overallRating, myRating: ownRating };
  });
}

async function upsertRating({ userId, storeId, ratingValue }) {
  const store = await Store.findByPk(storeId);
  if (!store) {
    const err = new Error('Store not found');
    err.status = 404;
    throw err;
  }

  const [rating] = await Rating.upsert(
    { user_id: userId, store_id: storeId, rating_value: ratingValue },
    { returning: true }
  );

  return rating;
}

module.exports = { listStoresForUser, upsertRating };
