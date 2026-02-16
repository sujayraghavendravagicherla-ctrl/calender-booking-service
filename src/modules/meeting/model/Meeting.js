const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const User = require('../../user/model/User');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_time'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'meetings',
  timestamps: true,
  indexes: [
    {
      // Index for faster conflict checking queries
      fields: ['user_id', 'start_time', 'end_time']
    },
    {
      // Index for filtering by date range
      fields: ['start_time', 'end_time']
    }
  ]
});

// Define association
Meeting.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Meeting, {
  foreignKey: 'userId',
  as: 'meetings'
});

module.exports = Meeting;