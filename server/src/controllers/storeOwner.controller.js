const storeOwnerService = require('../services/storeOwner.service');

async function dashboard(req, res, next) {
  try {
    const result = await storeOwnerService.getDashboard(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard };
