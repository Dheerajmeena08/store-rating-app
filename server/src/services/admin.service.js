const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { hashPassword } = require('../utils/password');

async function getDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
}

async function createUser({ name, email, address, password, role }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, address, password: hashed, role });
  const plain = user.toJSON();
  delete plain.password;
  return plain;
}

async function createStore({ name, email, address, ownerId }) {
  if (ownerId) {
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      const err = new Error('Specified owner does not exist');
      err.status = 400;
      throw err;
    }
    if (owner.role !== 'STORE_OWNER') {
      const err = new Error('Assigned owner must have the STORE_OWNER role');
      err.status = 400;
      throw err;
    }
  }

  const store = await Store.create({ name, email, address, owner_id: ownerId || null });
  return store;
}

function buildSortOrder(sortBy, order, allowedFields) {
  const field = allowedFields.includes(sortBy) ? sortBy : allowedFields[0];
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  return [[field, direction]];
}

function buildStoreSortOrder(sortBy, order) {
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  const allowedFields = ['name', 'email', 'address', 'created_at'];

  if (sortBy === 'averageRating') {
    return [[literal('averageRating'), direction]];
  }

  return buildSortOrder(sortBy, direction.toLowerCase(), allowedFields);
}

async function listUsers({ name, email, address, role, sortBy, order, page = 1, limit = 10 }) {
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
  if (role) where.role = role;

  const allowedFields = ['name', 'email', 'address', 'role', 'created_at'];
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await User.findAndCountAll({
    where,
    attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
    order: buildSortOrder(sortBy, order, allowedFields),
    limit: Number(limit),
    offset,
  });

  return { rows, total: count, page: Number(page), limit: Number(limit) };
}

async function listStores({ name, email, address, sortBy, order, page = 1, limit = 10 }) {
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  const allowedFields = ['name', 'email', 'address', 'created_at'];
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Store.findAndCountAll({
    where,
    order: buildStoreSortOrder(sortBy, order),
    limit: Number(limit),
    offset,
    include: [{ model: Rating, as: 'ratings', attributes: [] }],
    attributes: {
      include: [[fn('AVG', col('ratings.rating_value')), 'averageRating']],
    },
    group: ['Store.id'],
    subQuery: false,
  });

  return {
    rows: rows.map((store) => {
      const plain = store.toJSON();
      plain.averageRating = plain.averageRating ? Number(plain.averageRating).toFixed(2) : null;
      return plain;
    }),
    total: Array.isArray(count) ? count.length : count,
    page: Number(page),
    limit: Number(limit),
  };
}

async function getUserDetail(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
    include: [{ model: Store, as: 'ownedStore' }],
  });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const plain = user.toJSON();

  if (plain.role === 'STORE_OWNER' && plain.ownedStore) {
    const avg = await Rating.findOne({
      where: { store_id: plain.ownedStore.id },
      attributes: [[fn('AVG', col('rating_value')), 'averageRating']],
      raw: true,
    });
    plain.rating = avg?.averageRating ? Number(avg.averageRating).toFixed(2) : null;
  }

  return plain;
}

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetail,
};
