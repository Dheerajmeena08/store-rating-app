const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'stores', key: 'id' },
    },
    rating_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating must be at most 5' },
      },
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'store_id'],
        name: 'unique_user_store_rating',
      },
    ],
  }
);

module.exports = Rating;
