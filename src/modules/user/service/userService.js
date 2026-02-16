const User = require('../model/User');

class UserService {
  // Create a new user
  async createUser(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already exists');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  // Get all users (optional - for testing)
  async getAllUsers() {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });
    return users;
  }
}

module.exports = new UserService();