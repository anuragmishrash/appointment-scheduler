const express = require('express');
const router = express.Router();
const {
  createService,
  getBusinessServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, business } = require('../middleware/auth');

// @route   POST /api/services
// @desc    Create a new service
// @access  Private/Business
router.post('/', protect, business, createService);

// @route   GET /api/services/business/:businessId
// @desc    Get all services for a business
// @access  Public
router.get('/business/:businessId', getBusinessServices);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', getServiceById);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private/Business
router.put('/:id', protect, business, updateService);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private/Business
router.delete('/:id', protect, business, deleteService);

module.exports = router; 