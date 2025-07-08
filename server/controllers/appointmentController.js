const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { service, date, startTime, endTime, notes } = req.body;
    
    // Check if the time slot is available
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();
    
    // Find the service to get business ID
    const serviceData = await Service.findById(service);
    if (!serviceData) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if the business is available at this time
    const availability = await Availability.findOne({
      businessId: serviceData.businessId,
      dayOfWeek,
      startTime: { $lte: startTime },
      endTime: { $gte: endTime },
      isAvailable: true
    });
    
    if (!availability) {
      return res.status(400).json({ message: 'This time slot is not available' });
    }
    
    // Check for existing appointments at the same time
    const existingAppointment = await Appointment.findOne({
      business: serviceData.businessId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      startTime: startTime,
      status: { $ne: 'cancelled' }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Create the appointment
    const appointment = await Appointment.create({
      user: req.user._id,
      service,
      business: serviceData.businessId,
      date: appointmentDate,
      startTime,
      endTime,
      notes
    });
    
    // Get business information to check if it's a demo business
    const businessUser = await User.findById(serviceData.businessId);
    
    // Send confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Appointment Confirmation',
      text: `Your appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${startTime}.`,
      html: `
        <h1>Appointment Confirmation</h1>
        <p>Your appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${startTime}.</p>
        <p>Service: ${serviceData.name}</p>
        <p>Thank you for booking with us!</p>
      `
    };
    
    transporter.sendMail(customerMailOptions, (error) => {
      if (error) {
        console.error('Email sending error:', error);
      }
    });
    
    // Send notification to business owner if they are not a demo business
    if (businessUser && businessUser.email && !businessUser.isDemo) {
      const businessMailOptions = {
        from: process.env.EMAIL_USER,
        to: businessUser.email,
        subject: 'New Appointment Booking',
        text: `A new appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${startTime}.`,
        html: `
          <h1>New Appointment Booking</h1>
          <p>A new appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${startTime}.</p>
          <p>Service: ${serviceData.name}</p>
          <p>Customer: ${req.user.name}</p>
          <p>Contact: ${req.user.email}</p>
          ${req.user.phone ? `<p>Phone: ${req.user.phone}</p>` : ''}
          ${notes ? `<p>Notes: ${notes}</p>` : ''}
        `
      };
      
      transporter.sendMail(businessMailOptions, (error) => {
        if (error) {
          console.error('Business notification email sending error:', error);
        }
      });
    }
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all appointments for logged in user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // For regular users, return only their appointments as customers
    if (req.user.role === 'user') {
      const appointments = await Appointment.find({ user: req.user._id })
        .populate('user', 'name email')
        .populate('service')
        .populate('business', 'name email address');
      
      return res.json(appointments);
    }
    
    // For business users, return ALL appointments:
    // 1. Appointments they've made as a customer
    // 2. Appointments for their business services
    if (req.user.role === 'business') {
      const allAppointments = await Appointment.find({
        $or: [
          { user: req.user._id },    // Appointments they've made as customers
          { business: req.user._id } // Appointments for their business
        ]
      })
        .populate('user', 'name email')
        .populate('service')
        .populate('business', 'name email address');
      
      // Add a flag to indicate if the appointment is as a customer or as a business
      const enhancedAppointments = allAppointments.map(appointment => {
        const appointmentObj = appointment.toObject();
        appointmentObj.isBusinessAppointment = appointment.business._id.toString() === req.user._id.toString();
        return appointmentObj;
      });
      
      return res.json(enhancedAppointments);
    }
    
    // For admins, return all appointments
    const appointments = await Appointment.find({})
      .populate('user', 'name email')
      .populate('service')
      .populate('business', 'name email address');
    
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('service')
      .populate('business', 'name email address');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to view this appointment
    if (
      req.user.role !== 'admin' && 
      appointment.user._id.toString() !== req.user._id.toString() &&
      appointment.business._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to update this appointment
    // Allow business users to update appointments for their business
    if (
      req.user.role !== 'admin' && 
      appointment.user.toString() !== req.user._id.toString() &&
      appointment.business.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    // If only status is being updated (by business user), skip availability checks
    if (req.body.status && Object.keys(req.body).length === 1) {
      appointment.status = req.body.status;
      const updatedAppointment = await appointment.save();
      
      // Send notification email for status update
      try {
        const user = await User.findById(appointment.user);
        const service = await Service.findById(appointment.service);
        const business = await User.findById(appointment.business);
        
        if (user && user.email) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Appointment ${req.body.status === 'completed' ? 'Completed' : 'Status Update'}`,
            text: `Your appointment for ${new Date(appointment.date).toLocaleDateString()} has been marked as ${req.body.status}.`,
            html: `
              <h1>Appointment ${req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)}</h1>
              <p>Your appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as ${req.body.status}.</p>
              <p>Service: ${service?.name || 'N/A'}</p>
            `
          };
          
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.error('Email sending error:', error);
            }
          });
        }
        
        // Send notification to business owner if they are not a demo business
        if (business && business.email && !business.isDemo) {
          const businessMailOptions = {
            from: process.env.EMAIL_USER,
            to: business.email,
            subject: `Appointment ${req.body.status === 'completed' ? 'Completed' : 'Status Update'}`,
            text: `The appointment for ${new Date(appointment.date).toLocaleDateString()} has been marked as ${req.body.status}.`,
            html: `
              <h1>Appointment ${req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)}</h1>
              <p>The appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as ${req.body.status}.</p>
              <p>Service: ${service?.name || 'N/A'}</p>
              <p>Customer: ${user?.name || 'N/A'}</p>
            `
          };
          
          transporter.sendMail(businessMailOptions, (error) => {
            if (error) {
              console.error('Business notification email sending error:', error);
            }
          });
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }
      
      return res.json(updatedAppointment);
    }
    
    // If changing date or time, check availability
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const date = req.body.date || appointment.date;
      const startTime = req.body.startTime || appointment.startTime;
      const endTime = req.body.endTime || appointment.endTime;
      
      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.getDay();
      
      // Get service to find business ID
      const serviceId = req.body.service || appointment.service;
      const serviceData = await Service.findById(serviceId);
      
      // Check business availability
      const availability = await Availability.findOne({
        businessId: serviceData.businessId,
        dayOfWeek,
        startTime: { $lte: startTime },
        endTime: { $gte: endTime },
        isAvailable: true
      });
      
      if (!availability) {
        return res.status(400).json({ message: 'This time slot is not available' });
      }
      
      // Check for existing appointments at the same time (excluding this one)
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        date: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        },
        startTime: startTime,
        status: { $ne: 'cancelled' }
      });
      
      if (existingAppointment) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
    }
    
    // Update appointment fields
    appointment.service = req.body.service || appointment.service;
    appointment.date = req.body.date ? new Date(req.body.date) : appointment.date;
    appointment.startTime = req.body.startTime || appointment.startTime;
    appointment.endTime = req.body.endTime || appointment.endTime;
    appointment.status = req.body.status || appointment.status;
    appointment.notes = req.body.notes || appointment.notes;
    
    // If rescheduled, update status
    if (req.body.date || req.body.startTime) {
      appointment.status = 'rescheduled';
    }
    
    const updatedAppointment = await appointment.save();
    
    // Send update notification email
    const user = await User.findById(appointment.user);
    const service = await Service.findById(updatedAppointment.service);
    const business = await User.findById(updatedAppointment.business);
    
    // Send notification to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Appointment Update',
      text: `Your appointment has been updated to ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.startTime}.`,
      html: `
        <h1>Appointment Update</h1>
        <p>Your appointment has been updated to ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.startTime}.</p>
        <p>Service: ${service.name}</p>
        <p>Status: ${updatedAppointment.status}</p>
      `
    };
    
    transporter.sendMail(customerMailOptions, (error) => {
      if (error) {
        console.error('Email sending error:', error);
      }
    });
    
    // Send notification to business owner if they are not a demo business
    if (business && business.email && !business.isDemo) {
      const businessMailOptions = {
        from: process.env.EMAIL_USER,
        to: business.email,
        subject: 'Appointment Update',
        text: `An appointment has been updated to ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.startTime}.`,
        html: `
          <h1>Appointment Update</h1>
          <p>An appointment has been updated to ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.startTime}.</p>
          <p>Service: ${service.name}</p>
          <p>Customer: ${user.name}</p>
          <p>Status: ${updatedAppointment.status}</p>
        `
      };
      
      transporter.sendMail(businessMailOptions, (error) => {
        if (error) {
          console.error('Business notification email sending error:', error);
        }
      });
    }
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to cancel this appointment
    if (
      req.user.role !== 'admin' && 
      appointment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }
    
    // Update status to cancelled
    appointment.status = 'cancelled';
    await appointment.save();
    
    // Send cancellation email to customer
    const user = await User.findById(appointment.user);
    const service = await Service.findById(appointment.service);
    const business = await User.findById(appointment.business);
    
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Appointment Cancelled',
      text: `Your appointment for ${appointment.date.toLocaleDateString()} at ${appointment.startTime} has been cancelled.`,
      html: `
        <h1>Appointment Cancelled</h1>
        <p>Your appointment for ${appointment.date.toLocaleDateString()} at ${appointment.startTime} has been cancelled.</p>
        <p>Service: ${service.name}</p>
      `
    };
    
    transporter.sendMail(customerMailOptions, (error) => {
      if (error) {
        console.error('Email sending error:', error);
      }
    });
    
    // Send notification to business owner if they are not a demo business
    if (business && business.email && !business.isDemo) {
      const businessMailOptions = {
        from: process.env.EMAIL_USER,
        to: business.email,
        subject: 'Appointment Cancelled',
        text: `An appointment for ${appointment.date.toLocaleDateString()} at ${appointment.startTime} has been cancelled.`,
        html: `
          <h1>Appointment Cancelled</h1>
          <p>An appointment for ${appointment.date.toLocaleDateString()} at ${appointment.startTime} has been cancelled.</p>
          <p>Service: ${service.name}</p>
          <p>Customer: ${user.name}</p>
          <p>Contact: ${user.email}</p>
          ${user.phone ? `<p>Phone: ${user.phone}</p>` : ''}
          ${appointment.notes ? `<p>Notes: ${appointment.notes}</p>` : ''}
        `
      };
      
      transporter.sendMail(businessMailOptions, (error) => {
        if (error) {
          console.error('Business notification email sending error:', error);
        }
      });
    }
    
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Restore incorrectly auto-cancelled future appointments
// @route   POST /api/appointments/restore-future
// @access  Private/Admin
const restoreFutureAppointments = async (req, res) => {
  try {
    const now = new Date();
    
    // Find future appointments that were auto-marked as missed
    const futureMissedAppointments = await Appointment.find({
      $and: [
        // Either date is in the future
        { 
          date: { $gt: now }
        },
        // Or date is today but time is in the future
        {
          date: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          },
          startTime: { 
            $gte: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` 
          }
        },
        // Was auto-marked as missed
        { status: 'missed', autoCancelled: true }
      ]
    });
    
    console.log(`Found ${futureMissedAppointments.length} future appointments to restore`);
    
    // Restore each appointment
    let restoredCount = 0;
    for (const appointment of futureMissedAppointments) {
      appointment.status = 'scheduled';
      appointment.autoCancelled = false;
      await appointment.save();
      restoredCount++;
    }
    
    res.json({ 
      message: `Restored ${restoredCount} future appointments`, 
      count: restoredCount
    });
  } catch (error) {
    console.error('Error restoring appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  restoreFutureAppointments,
};