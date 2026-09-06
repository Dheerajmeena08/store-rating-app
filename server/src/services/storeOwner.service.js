const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

async function getDashboard(ownerId) {
  const store = await Store.findOne({ where: { owner_id: ownerId } });

  if (!store) {
    const err = new Error('No store is currently assigned to this account');
    err.status = 404;
    throw err;
  }

  const ratings = await Rating.findAll({
    where: { store_id: store.id },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
    order: [['created_at', 'DESC']],
  });

  const avgResult = await Rating.findOne({
    where: { store_id: store.id },
    attributes: [[fn('AVG', col('rating_value')), 'averageRating']],
    raw: true,
  });

  return {
    store: { id: store.id, name: store.name, email: store.email, address: store.address },
    averageRating: avgResult?.averageRating ? Number(avgResult.averageRating).toFixed(2) : null,
    totalRatings: ratings.length,
    raters: ratings.map((r) => ({
      ratingId: r.id,
      ratingValue: r.rating_value,
      submittedAt: r.created_at,
      user: r.user,
    })),
  };
}

module.exports = { getDashboard };
