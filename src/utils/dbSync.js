const { sequelize } = require('../config/database');
const User = require('../modules/user/model/User');
const Meeting = require('../modules/meeting/model/Meeting');

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error.message);
    throw error;
  }
};

module.exports = { syncDatabase };