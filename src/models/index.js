const sequelize = require('../config/database');
const MenuItem = require('./MenuItem');

// Initialize models
const models = {
  MenuItem,
  sequelize
};

// Set up associations here if needed
// Example: MenuItem.belongsTo(Category);

module.exports = models;