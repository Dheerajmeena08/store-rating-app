const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/stores', require('./store.routes'));
router.use('/store-owner', require('./storeOwner.routes'));

module.exports = router;
