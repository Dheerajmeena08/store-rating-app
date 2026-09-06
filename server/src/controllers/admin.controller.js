const adminService = require('../services/admin.service');

async function dashboard(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await adminService.createUser(req.validatedBody);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function createStore(req, res, next) {
  try {
    const store = await adminService.createStore(req.validatedBody);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy, order, page, limit } = req.query;
    const result = await adminService.listUsers({ name, email, address, role, sortBy, order, page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function listStores(req, res, next) {
  try {
    const { name, email, address, sortBy, order, page, limit } = req.query;
    const result = await adminService.listStores({ name, email, address, sortBy, order, page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getUserDetail(req, res, next) {
  try {
    const user = await adminService.getUserDetail(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, createUser, createStore, listUsers, listStores, getUserDetail };
