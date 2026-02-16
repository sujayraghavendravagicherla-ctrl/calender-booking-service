const UserService = require('../service/UserService');
const { CreateUserDto } = require('../dto/CreateUserDto');

class UserController {
  // POST /users - Create a new user
  async createUser(req, res, next) {
    try {
      // Validate input using DTO
      const createUserDto = new CreateUserDto(req.body);
      const validation = createUserDto.validate();

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Create user
      const user = await UserService.createUser({
        name: createUserDto.name,
        email: createUserDto.email
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /users/:id - Get user by ID
  async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await UserService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();