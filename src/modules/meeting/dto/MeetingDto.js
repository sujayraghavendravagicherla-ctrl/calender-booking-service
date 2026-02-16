// DTO for creating a meeting
class CreateMeetingDto {
  constructor(data) {
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }

  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (this.userId && !Number.isInteger(Number(this.userId))) {
      errors.push('User ID must be a valid number');
    }

    if (!this.title || this.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!this.startTime) {
      errors.push('Start time is required');
    }

    if (!this.endTime) {
      errors.push('End time is required');
    }

    // Validate date formats
    if (this.startTime && !this.isValidDate(this.startTime)) {
      errors.push('Start time must be a valid ISO 8601 date');
    }

    if (this.endTime && !this.isValidDate(this.endTime)) {
      errors.push('End time must be a valid ISO 8601 date');
    }

    // Check if start time is before end time
    if (this.startTime && this.endTime && this.isValidDate(this.startTime) && this.isValidDate(this.endTime)) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      
      if (start >= end) {
        errors.push('Start time must be before end time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

// DTO for updating a meeting
class UpdateMeetingDto {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }

  validate() {
    const errors = [];

    // At least one field should be provided
    if (!this.title && !this.description && !this.startTime && !this.endTime) {
      errors.push('At least one field must be provided for update');
    }

    if (this.title !== undefined && this.title.trim() === '') {
      errors.push('Title cannot be empty');
    }

    // Validate date formats if provided
    if (this.startTime && !this.isValidDate(this.startTime)) {
      errors.push('Start time must be a valid ISO 8601 date');
    }

    if (this.endTime && !this.isValidDate(this.endTime)) {
      errors.push('End time must be a valid ISO 8601 date');
    }

    // Check if start time is before end time when both are provided
    if (this.startTime && this.endTime) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      
      if (start >= end) {
        errors.push('Start time must be before end time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = { CreateMeetingDto, UpdateMeetingDto };