const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: { field: 'auth', message: 'Missing or invalid authorization header' },
      });
    }

    const payload = verifyToken(token);

    const user = await User.findByPk(payload.userId, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });

    if (!user) {
      return res.status(401).json({
        error: { field: 'auth', message: 'User no longer exists' },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { field: 'auth', message: 'Invalid or expired token' },
    });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { field: 'auth', message: 'You do not have permission to perform this action' },
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
