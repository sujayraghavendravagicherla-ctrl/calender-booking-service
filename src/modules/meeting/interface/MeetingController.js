const MeetingService = require('../service/MeetingService');
const { CreateMeetingDto, UpdateMeetingDto } = require('../dto/MeetingDto');

class MeetingController {
  // POST /meetings - Create a new meeting
  async createMeeting(req, res, next) {
    try {
      // Validate input using DTO
      const createMeetingDto = new CreateMeetingDto(req.body);
      const validation = createMeetingDto.validate();

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Create meeting
      const meeting = await MeetingService.createMeeting({
        userId: createMeetingDto.userId,
        title: createMeetingDto.title,
        description: createMeetingDto.description || null,
        startTime: new Date(createMeetingDto.startTime),
        endTime: new Date(createMeetingDto.endTime)
      });

      return res.status(201).json({
        success: true,
        message: 'Meeting created successfully',
        data: {
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          user: meeting.user,
          createdAt: meeting.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /meetings - Get all meetings with optional filters
  async getAllMeetings(req, res, next) {
    try {
      const filters = {};

      // Parse userId from query
      if (req.query.userId) {
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid userId parameter'
          });
        }
        filters.userId = userId;
      }

      // Parse startDate from query
      if (req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        if (isNaN(startDate)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid startDate parameter'
          });
        }
        filters.startDate = startDate;
      }

      // Parse endDate from query
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        if (isNaN(endDate)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid endDate parameter'
          });
        }
        filters.endDate = endDate;
      }

      const meetings = await MeetingService.getAllMeetings(filters);

      return res.status(200).json({
        success: true,
        count: meetings.length,
        data: meetings.map(meeting => ({
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          user: meeting.user,
          createdAt: meeting.createdAt
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /meetings/:id - Get meeting by ID
  async getMeetingById(req, res, next) {
    try {
      const meetingId = parseInt(req.params.id);

      if (isNaN(meetingId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid meeting ID'
        });
      }

      const meeting = await MeetingService.getMeetingById(meetingId);

      return res.status(200).json({
        success: true,
        data: {
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          user: meeting.user,
          createdAt: meeting.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /meetings/:id - Update a meeting
  async updateMeeting(req, res, next) {
    try {
      const meetingId = parseInt(req.params.id);

      if (isNaN(meetingId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid meeting ID'
        });
      }

      // Validate input using DTO
      const updateMeetingDto = new UpdateMeetingDto(req.body);
      const validation = updateMeetingDto.validate();

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Prepare update data
      const updateData = {};
      if (updateMeetingDto.title) updateData.title = updateMeetingDto.title;
      if (updateMeetingDto.description !== undefined) updateData.description = updateMeetingDto.description;
      if (updateMeetingDto.startTime) updateData.startTime = new Date(updateMeetingDto.startTime);
      if (updateMeetingDto.endTime) updateData.endTime = new Date(updateMeetingDto.endTime);

      // Update meeting
      const meeting = await MeetingService.updateMeeting(meetingId, updateData);

      return res.status(200).json({
        success: true,
        message: 'Meeting updated successfully',
        data: {
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          user: meeting.user,
          updatedAt: meeting.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /meetings/:id - Delete a meeting
  async deleteMeeting(req, res, next) {
    try {
      const meetingId = parseInt(req.params.id);

      if (isNaN(meetingId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid meeting ID'
        });
      }

      await MeetingService.deleteMeeting(meetingId);

      return res.status(200).json({
        success: true,
        message: 'Meeting deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeetingController();