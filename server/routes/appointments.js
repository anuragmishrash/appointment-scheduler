const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', protect, createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments for logged in user
// @access  Private
router.get('/', protect, getAppointments);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, getAppointmentById);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, cancelAppointment);

module.exports = router; 