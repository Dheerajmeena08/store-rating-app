const express = require('express');
const router = express.Router();

const storeController = require('../controllers/store.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { submitRatingSchema } = require('../validators/schemas');

router.use(authenticate, authorize('NORMAL_USER', 'ADMIN'));

router.get('/', storeController.listStores);
router.put('/:id/rating', validate(submitRatingSchema), storeController.submitOrUpdateRating);

module.exports = router;
