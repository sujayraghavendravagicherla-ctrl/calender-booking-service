const { Op } = require('sequelize');
const Meeting = require('../model/Meeting');
const User = require('../../user/model/User');

class MeetingService {
  // Check for overlapping meetings
  async checkForConflicts(userId, startTime, endTime, excludeMeetingId = null) {
    const whereClause = {
      userId: userId,
      [Op.and]: [
        {
          startTime: {
            [Op.lt]: endTime  // existing.startTime < new.endTime
          }
        },
        {
          endTime: {
            [Op.gt]: startTime  // existing.endTime > new.startTime
          }
        }
      ]
    };

    // Exclude current meeting when updating
    if (excludeMeetingId) {
      whereClause.id = {
        [Op.ne]: excludeMeetingId
      };
    }

    const conflicts = await Meeting.findAll({
      where: whereClause,
      attributes: ['id', 'title', 'startTime', 'endTime']
    });

    return conflicts;
  }

  // Create a new meeting
  async createMeeting(meetingData) {
    // Check if user exists
    const user = await User.findByPk(meetingData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check for conflicts
    const conflicts = await this.checkForConflicts(
      meetingData.userId,
      meetingData.startTime,
      meetingData.endTime
    );

    if (conflicts.length > 0) {
      throw new Error('Time slot already booked');
    }

    // Create meeting
    const meeting = await Meeting.create(meetingData);
    
    // Return meeting with user details
    const meetingWithUser = await Meeting.findByPk(meeting.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    return meetingWithUser;
  }

  // Get all meetings with optional filters
  async getAllMeetings(filters = {}) {
    const whereClause = {};

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.startDate && filters.endDate) {
      whereClause[Op.and] = [
        {
          startTime: {
            [Op.gte]: filters.startDate
          }
        },
        {
          endTime: {
            [Op.lte]: filters.endDate
          }
        }
      ];
    } else if (filters.startDate) {
      whereClause.startTime = {
        [Op.gte]: filters.startDate
      };
    } else if (filters.endDate) {
      whereClause.endTime = {
        [Op.lte]: filters.endDate
      };
    }

    const meetings = await Meeting.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['startTime', 'ASC']]
    });

    return meetings;
  }

  // Get meeting by ID
  async getMeetingById(meetingId) {
    const meeting = await Meeting.findByPk(meetingId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    return meeting;
  }

  // Update a meeting
  async updateMeeting(meetingId, updateData) {
    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    // Prepare the data to check for conflicts
    const startTime = updateData.startTime || meeting.startTime;
    const endTime = updateData.endTime || meeting.endTime;

    // Validate that start time is before end time
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('Start time must be before end time');
    }

    // Check for conflicts (excluding current meeting)
    const conflicts = await this.checkForConflicts(
      meeting.userId,
      startTime,
      endTime,
      meetingId
    );

    if (conflicts.length > 0) {
      throw new Error('Time slot already booked');
    }

    // Update meeting
    await meeting.update(updateData);

    // Return updated meeting with user details
    const updatedMeeting = await Meeting.findByPk(meetingId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    return updatedMeeting;
  }

  // Delete a meeting
  async deleteMeeting(meetingId) {
    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    await meeting.destroy();
    return true;
  }
}

module.exports = new MeetingService();