const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

async function signup({ name, email, address, password }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    address,
    password: hashed,
    role: 'NORMAL_USER',
  });

  return sanitizeUser(user);
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user: sanitizeUser(user) };
}

async function updatePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }

  user.password = await hashPassword(newPassword);
  await user.save();
  return { message: 'Password updated successfully' };
}

function sanitizeUser(user) {
  const plain = user.toJSON ? user.toJSON() : user;
  delete plain.password;
  return plain;
}

module.exports = { signup, login, updatePassword, sanitizeUser };
