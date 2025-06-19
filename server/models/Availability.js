const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String, // Format: "HH:MM" in 24-hour format
    required: true
  },
  endTime: {
    type: String, // Format: "HH:MM" in 24-hour format
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // For specific dates (e.g., holidays)
  specificDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness of business availability
AvailabilitySchema.index({ businessId: 1, dayOfWeek: 1, specificDate: 1 }, { unique: true });

module.exports = mongoose.model('Availability', AvailabilitySchema); 