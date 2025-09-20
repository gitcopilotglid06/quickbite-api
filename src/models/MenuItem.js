const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.01
    }
  },
  category: {
    type: DataTypes.ENUM('appetizer', 'main', 'dessert', 'beverage'),
    allowNull: false,
    validate: {
      isIn: [['appetizer', 'main', 'dessert', 'beverage']]
    }
  },
  dietaryTag: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  }
}, {
  tableName: 'menu_items',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['name']
    }
  ]
});

module.exports = MenuItem;