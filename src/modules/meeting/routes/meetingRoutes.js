const express = require('express');
const router = express.Router();
const MeetingController = require('../interface/MeetingController');

// POST /meetings - Create a new meeting
router.post('/', (req, res, next) => MeetingController.createMeeting(req, res, next));

// GET /meetings - Get all meetings with optional filters
router.get('/', (req, res, next) => MeetingController.getAllMeetings(req, res, next));

// GET /meetings/:id - Get meeting by ID
router.get('/:id', (req, res, next) => MeetingController.getMeetingById(req, res, next));

// PUT /meetings/:id - Update a meeting
router.put('/:id', (req, res, next) => MeetingController.updateMeeting(req, res, next));

// DELETE /meetings/:id - Delete a meeting
router.delete('/:id', (req, res, next) => MeetingController.deleteMeeting(req, res, next));

module.exports = router;