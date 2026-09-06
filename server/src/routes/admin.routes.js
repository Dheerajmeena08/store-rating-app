const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  adminCreateUserSchema,
  adminCreateStoreSchema,
} = require('../validators/schemas');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.dashboard);

router.post('/users', validate(adminCreateUserSchema), adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);

router.post('/stores', validate(adminCreateStoreSchema), adminController.createStore);
router.get('/stores', adminController.listStores);

module.exports = router;
