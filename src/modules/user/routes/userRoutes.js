const express = require('express');
const router = express.Router();
const UserController = require('../interface/UserController');

// POST /users - Create a new user
router.post('/', (req, res, next) => UserController.createUser(req, res, next));

// GET /users/:id - Get user by ID
router.get('/:id', (req, res, next) => UserController.getUserById(req, res, next));

module.exports = router;