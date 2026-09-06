const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Store extends Model {}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: 'Store name must be between 20 and 60 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Store',
    tableName: 'stores',
    timestamps: true,
  }
);

module.exports = Store;
