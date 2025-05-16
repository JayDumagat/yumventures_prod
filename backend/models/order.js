'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Order.belongsTo(models.User, {
        foreignKey: 'orderedBy',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      
    }
  }
  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tenderedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    orderedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    status: {
      type: DataTypes.ENUM('processing', 'ready for pick up', 'completed'),
      allowNull: false,
      defaultValue: 'processing',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
    paranoid: true,
  });
  return Order;
};