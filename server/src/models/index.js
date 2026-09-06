const sequelize = require('../config/db');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');

User.hasOne(Store, { foreignKey: 'owner_id', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
