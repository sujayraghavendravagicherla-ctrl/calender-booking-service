// Data Transfer Object for User creation
class CreateUserDto {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
  }

  // Validate the data
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!this.email || this.email.trim() === '') {
      errors.push('Email is required');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email must be a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = { CreateUserDto };