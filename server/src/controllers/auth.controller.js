const authService = require('../services/auth.service');

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.validatedBody);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.validatedBody);
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully' });
}

async function updatePassword(req, res, next) {
  try {
    const result = await authService.updatePassword(req.user.id, req.validatedBody);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { signup, login, logout, updatePassword, me };
