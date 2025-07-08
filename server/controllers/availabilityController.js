const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

// @desc    Set business availability
// @route   POST /api/availability
// @access  Private/Business
const setAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, isAvailable, specificDate } = req.body;
    
    // Check if availability already exists for this day
    let availability = await Availability.findOne({
      businessId: req.user._id,
      dayOfWeek,
      specificDate: specificDate || null
    });
    
    if (availability) {
      // Update existing availability
      availability.startTime = startTime || availability.startTime;
      availability.endTime = endTime || availability.endTime;
      availability.isAvailable = isAvailable !== undefined ? isAvailable : availability.isAvailable;
      
      await availability.save();
      res.json(availability);
    } else {
      // Create new availability
      const newAvailability = await Availability.create({
        businessId: req.user._id,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        specificDate: specificDate || null
      });
      
      res.status(201).json(newAvailability);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get business availability
// @route   GET /api/availability/:businessId
// @access  Public
const getBusinessAvailability = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const availability = await Availability.find({
      businessId,
      isAvailable: true
    }).sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/availability/slots/:businessId/:date
// @access  Public
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { businessId, date } = req.params;
    
    // Convert date string to Date object
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
    
    // Get current date and time
    const currentDate = new Date();
    
    // Check if the requested date is today (comparing dates only, not times)
    const isToday = requestedDate.toDateString() === currentDate.toDateString();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    
    console.log(`Finding availability for businessId: ${businessId}, date: ${date}, dayOfWeek: ${dayOfWeek}`);
    console.log(`Current server time: ${currentDate.toISOString()}, Timezone: ${process.env.TZ || 'default'}`);
    console.log(`Is today: ${isToday}, Current hour: ${currentHour}, Current minute: ${currentMinute}`);
    
    // Get business availability for this day
    const availabilityList = await Availability.find({
      businessId,
      $or: [
        { dayOfWeek, specificDate: null, isAvailable: true },
        { specificDate: requestedDate, isAvailable: true }
      ]
    });
    
    console.log(`Found ${availabilityList.length} availability records`);
    
    if (!availabilityList || availabilityList.length === 0) {
      // If no availability found, create default availability for this day
      // This helps with newly created business accounts
      console.log('No availability found, creating default availability');
      
      const defaultAvailability = await Availability.create({
        businessId,
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true
      });
      
      availabilityList.push(defaultAvailability);
    }
    
    // Get all appointments for this date AND this business
    const appointments = await Appointment.find({
      business: businessId,
      date: {
        $gte: requestedDate,
        $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $ne: 'cancelled' }
    });
    
    console.log(`Found ${appointments.length} existing appointments`);
    
    // Generate available time slots (30-minute intervals)
    const timeSlots = [];
    
    availabilityList.forEach(availability => {
      let startHour = parseInt(availability.startTime.split(':')[0]);
      let startMinute = parseInt(availability.startTime.split(':')[1]);
      const endHour = parseInt(availability.endTime.split(':')[0]);
      const endMinute = parseInt(availability.endTime.split(':')[1]);
      
      // Generate slots in 30-minute intervals
      while (
        startHour < endHour || 
        (startHour === endHour && startMinute < endMinute)
      ) {
        const startTimeStr = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        
        // Calculate end time (30 minutes later)
        let endTimeHour = startHour;
        let endTimeMinute = startMinute + 30;
        
        if (endTimeMinute >= 60) {
          endTimeHour += 1;
          endTimeMinute -= 60;
        }
        
        const endTimeStr = `${endTimeHour.toString().padStart(2, '0')}:${endTimeMinute.toString().padStart(2, '0')}`;
        
        // Check if this slot conflicts with any appointment
        const isBooked = appointments.some(appointment => 
          appointment.startTime === startTimeStr
        );
        
        // Skip this slot if it's in the past for today
        // Give at least 15 minutes buffer for booking (can't book a slot starting in less than 15 minutes)
        const bufferMinutes = 15;
        let isPastTimeSlot = false;
        
        if (isToday) {
          // Create time objects for comparison
          const slotTime = new Date(requestedDate);
          slotTime.setHours(startHour, startMinute);
          
          const currentTimePlusBuffer = new Date(currentDate.getTime() + bufferMinutes * 60 * 1000);
          
          isPastTimeSlot = slotTime < currentTimePlusBuffer;
        }
        
        if (!isBooked && !isPastTimeSlot) {
          timeSlots.push({
            startTime: startTimeStr,
            endTime: endTimeStr
          });
        } else {
          console.log(`Skipping time slot ${startTimeStr} - isBooked: ${isBooked}, isPastTimeSlot: ${isPastTimeSlot}`);
        }
        
        // Move to next slot
        startMinute += 30;
        if (startMinute >= 60) {
          startHour += 1;
          startMinute -= 60;
        }
      }
    });
    
    console.log(`Returning ${timeSlots.length} available time slots`);
    res.json(timeSlots);
  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete availability
// @route   DELETE /api/availability/:id
// @access  Private/Business
const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    
    // Check if user is authorized to delete this availability
    if (availability.businessId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await availability.remove();
    res.json({ message: 'Availability removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  setAvailability,
  getBusinessAvailability,
  getAvailableTimeSlots,
  deleteAvailability
}; 