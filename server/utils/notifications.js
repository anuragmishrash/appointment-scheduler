const nodemailer = require('nodemailer');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send appointment reminder emails
const sendAppointmentReminders = async () => {
  try {
    // Get all appointments scheduled for tomorrow that haven't had notifications sent
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    
    const appointments = await Appointment.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      status: 'scheduled',
      notificationSent: false
    });
    
    // Send email for each appointment
    for (const appointment of appointments) {
      const user = await User.findById(appointment.user);
      const service = await Service.findById(appointment.service);
      const business = await User.findById(appointment.business);
      
      // Send reminder to customer
      if (user && service) {
        const customerMailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Appointment Reminder',
          text: `Reminder: You have an appointment scheduled for tomorrow at ${appointment.startTime}.`,
          html: `
            <h1>Appointment Reminder</h1>
            <p>This is a friendly reminder that you have an appointment scheduled for tomorrow, ${appointment.date.toLocaleDateString()} at ${appointment.startTime}.</p>
            <p>Service: ${service.name}</p>
            <p>If you need to reschedule, please log in to your account or contact us.</p>
            <p>Thank you!</p>
          `
        };
        
        await transporter.sendMail(customerMailOptions);
        
        // Send reminder to business owner if they are not a demo business
        if (business && business.email && !business.isDemo) {
          const businessMailOptions = {
            from: process.env.EMAIL_USER,
            to: business.email,
            subject: 'Appointment Reminder',
            text: `Reminder: You have an appointment scheduled for tomorrow at ${appointment.startTime}.`,
            html: `
              <h1>Appointment Reminder</h1>
              <p>This is a friendly reminder that you have an appointment scheduled for tomorrow, ${appointment.date.toLocaleDateString()} at ${appointment.startTime}.</p>
              <p>Service: ${service.name}</p>
              <p>Customer: ${user.name}</p>
              <p>Contact: ${user.email}</p>
              ${user.phone ? `<p>Phone: ${user.phone}</p>` : ''}
              ${appointment.notes ? `<p>Notes: ${appointment.notes}</p>` : ''}
            `
          };
          
          await transporter.sendMail(businessMailOptions);
        }
        
        // Mark notification as sent
        appointment.notificationSent = true;
        await appointment.save();
      }
    }
    
    console.log(`Sent ${appointments.length} appointment reminders`);
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
  }
};

module.exports = {
  sendAppointmentReminders
}; 