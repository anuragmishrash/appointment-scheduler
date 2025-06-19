const express = require('express');
const router = express.Router();
const {
  setAvailability,
  getBusinessAvailability,
  getAvailableTimeSlots,
  deleteAvailability
} = require('../controllers/availabilityController');
const { protect, business } = require('../middleware/auth');

// @route   POST /api/availability
// @desc    Set business availability
// @access  Private/Business
router.post('/', protect, business, setAvailability);

// @route   GET /api/availability/:businessId
// @desc    Get business availability
// @access  Public
router.get('/:businessId', getBusinessAvailability);

// @route   GET /api/availability/slots/:businessId/:date
// @desc    Get available time slots for a specific date
// @access  Public
router.get('/slots/:businessId/:date', getAvailableTimeSlots);

// @route   DELETE /api/availability/:id
// @desc    Delete availability
// @access  Private/Business
router.delete('/:id', protect, business, deleteAvailability);

module.exports = router; 