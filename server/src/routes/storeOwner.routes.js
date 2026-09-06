const express = require('express');
const router = express.Router();

const storeOwnerController = require('../controllers/storeOwner.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', storeOwnerController.dashboard);

module.exports = router;
