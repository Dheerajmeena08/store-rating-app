const storeService = require('../services/store.service');

async function listStores(req, res, next) {
  try {
    const { name, address } = req.query;
    const stores = await storeService.listStoresForUser({ name, address, userId: req.user.id });
    res.status(200).json({ stores });
  } catch (err) {
    next(err);
  }
}

async function submitOrUpdateRating(req, res, next) {
  try {
    const { id } = req.params;
    const { ratingValue } = req.validatedBody;
    const rating = await storeService.upsertRating({
      userId: req.user.id,
      storeId: id,
      ratingValue,
    });
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStores, submitOrUpdateRating };
