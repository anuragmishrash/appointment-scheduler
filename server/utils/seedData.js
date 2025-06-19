const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const businessPassword = await bcrypt.hash('business123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      phone: '555-123-4567'
    });

    // Create multiple business users
    const business1 = await User.create({
      name: 'Hair & Style Salon',
      email: 'salon@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-987-6543',
      address: '123 Beauty St, City, State 12345',
      businessDetails: {
        businessName: 'Hair & Style Salon',
        description: 'Professional hair styling and beauty services',
        website: 'www.hairstylesalon.com',
        category: 'Beauty & Wellness'
      },
      isDemo: true
    });

    const business2 = await User.create({
      name: 'Dental Care Center',
      email: 'dental@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-456-7890',
      address: '456 Health Ave, City, State 12345',
      businessDetails: {
        businessName: 'Dental Care Center',
        description: 'Professional dental services for the whole family',
        website: 'www.dentalcare.com',
        category: 'Healthcare'
      },
      isDemo: true
    });

    const business3 = await User.create({
      name: 'Fitness Studio',
      email: 'fitness@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-789-0123',
      address: '789 Fitness Blvd, City, State 12345',
      businessDetails: {
        businessName: 'Fitness Studio',
        description: 'Personal training and group fitness classes',
        website: 'www.fitnessstudio.com',
        category: 'Fitness & Wellness'
      },
      isDemo: true
    });

    const business4 = await User.create({
      name: 'Spa & Massage Center',
      email: 'spa@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-234-5678',
      address: '234 Relaxation Rd, City, State 12345',
      businessDetails: {
        businessName: 'Spa & Massage Center',
        description: 'Relaxing massages and spa treatments',
        website: 'www.spamassage.com',
        category: 'Beauty & Wellness'
      },
      isDemo: true
    });

    const business5 = await User.create({
      name: 'Tech Repair Shop',
      email: 'techrepair@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-345-6789',
      address: '345 Tech Ave, City, State 12345',
      businessDetails: {
        businessName: 'Tech Repair Shop',
        description: 'Professional repair services for all your devices',
        website: 'www.techrepair.com',
        category: 'Technology'
      },
      isDemo: true
    });

    const business6 = await User.create({
      name: 'Legal Consultancy',
      email: 'legal@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-456-7890',
      address: '456 Law St, City, State 12345',
      businessDetails: {
        businessName: 'Legal Consultancy',
        description: 'Professional legal advice and consultations',
        website: 'www.legalconsult.com',
        category: 'Professional Services'
      },
      isDemo: true
    });

    const business7 = await User.create({
      name: 'Auto Service Center',
      email: 'auto@example.com',
      password: businessPassword,
      role: 'business',
      phone: '555-567-8901',
      address: '567 Auto Lane, City, State 12345',
      businessDetails: {
        businessName: 'Auto Service Center',
        description: 'Complete auto repair and maintenance services',
        website: 'www.autoservice.com',
        category: 'Automotive'
      },
      isDemo: true
    });

    console.log('Created users');

    // Create services for each business
    // Hair & Style Salon services
    const haircut = await Service.create({
      businessId: business1._id,
      name: 'Haircut',
      description: 'Professional haircut service',
      duration: 30,
      price: 35.00,
      active: true
    });

    const coloring = await Service.create({
      businessId: business1._id,
      name: 'Hair Coloring',
      description: 'Professional hair coloring service',
      duration: 90,
      price: 85.00,
      active: true
    });

    const styling = await Service.create({
      businessId: business1._id,
      name: 'Hair Styling',
      description: 'Professional hair styling for special occasions',
      duration: 60,
      price: 55.00,
      active: true
    });

    // Dental Care Center services
    const cleaning = await Service.create({
      businessId: business2._id,
      name: 'Teeth Cleaning',
      description: 'Professional dental cleaning',
      duration: 45,
      price: 80.00,
      active: true
    });

    const checkup = await Service.create({
      businessId: business2._id,
      name: 'Dental Checkup',
      description: 'Comprehensive dental examination',
      duration: 30,
      price: 60.00,
      active: true
    });

    // Fitness Studio services
    const personalTraining = await Service.create({
      businessId: business3._id,
      name: 'Personal Training',
      description: 'One-on-one personal training session',
      duration: 60,
      price: 70.00,
      active: true
    });

    const groupClass = await Service.create({
      businessId: business3._id,
      name: 'Group Fitness Class',
      description: 'Group fitness class for all levels',
      duration: 45,
      price: 25.00,
      active: true
    });

    // Spa & Massage Center services
    const massage = await Service.create({
      businessId: business4._id,
      name: 'Full Body Massage',
      description: 'Relaxing full body massage',
      duration: 60,
      price: 90.00,
      active: true
    });

    const facial = await Service.create({
      businessId: business4._id,
      name: 'Facial Treatment',
      description: 'Rejuvenating facial treatment',
      duration: 45,
      price: 65.00,
      active: true
    });

    // Tech Repair Shop services
    const phoneRepair = await Service.create({
      businessId: business5._id,
      name: 'Phone Screen Repair',
      description: 'Screen replacement for smartphones',
      duration: 60,
      price: 120.00,
      active: true
    });

    const computerDiagnostic = await Service.create({
      businessId: business5._id,
      name: 'Computer Diagnostic',
      description: 'Full diagnostic of computer issues',
      duration: 45,
      price: 70.00,
      active: true
    });

    // Legal Consultancy services
    const legalConsultation = await Service.create({
      businessId: business6._id,
      name: 'Legal Consultation',
      description: 'One-on-one legal consultation',
      duration: 60,
      price: 150.00,
      active: true
    });

    const documentReview = await Service.create({
      businessId: business6._id,
      name: 'Document Review',
      description: 'Legal review of documents',
      duration: 45,
      price: 100.00,
      active: true
    });

    // Auto Service Center services
    const oilChange = await Service.create({
      businessId: business7._id,
      name: 'Oil Change',
      description: 'Standard oil change service',
      duration: 30,
      price: 45.00,
      active: true
    });

    const tireRotation = await Service.create({
      businessId: business7._id,
      name: 'Tire Rotation',
      description: 'Tire rotation and balance',
      duration: 45,
      price: 55.00,
      active: true
    });

    console.log('Created services');

    // Create availability for each business
    // Monday to Friday, 9 AM to 5 PM for all businesses
    const businesses = [business1, business2, business3, business4, business5, business6, business7];
    
    for (const business of businesses) {
      // Weekdays
      for (let day = 1; day <= 5; day++) {
        await Availability.create({
          businessId: business._id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true
        });
      }
      
      // Saturday
      await Availability.create({
        businessId: business._id,
        dayOfWeek: 6,
        startTime: '10:00',
        endTime: '15:00',
        isAvailable: true
      });
    }

    console.log('Created availability');

    // Create appointments
    // Tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: haircut._id,
      business: business1._id,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      notes: 'First time customer'
    });

    // Next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: cleaning._id,
      business: business2._id,
      date: nextWeek,
      startTime: '14:00',
      endTime: '14:45',
      status: 'scheduled',
      notes: 'Regular checkup'
    });

    // Two weeks from now
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    twoWeeks.setHours(11, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: personalTraining._id,
      business: business3._id,
      date: twoWeeks,
      startTime: '11:00',
      endTime: '12:00',
      status: 'scheduled',
      notes: 'Focus on strength training'
    });

    // Three days from now
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    threeDays.setHours(15, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: massage._id,
      business: business4._id,
      date: threeDays,
      startTime: '15:00',
      endTime: '16:00',
      status: 'scheduled',
      notes: 'Deep tissue massage'
    });

    // Five days from now
    const fiveDays = new Date();
    fiveDays.setDate(fiveDays.getDate() + 5);
    fiveDays.setHours(13, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: phoneRepair._id,
      business: business5._id,
      date: fiveDays,
      startTime: '13:00',
      endTime: '14:00',
      status: 'scheduled',
      notes: 'iPhone screen cracked'
    });

    // Ten days from now
    const tenDays = new Date();
    tenDays.setDate(tenDays.getDate() + 10);
    tenDays.setHours(9, 0, 0, 0);

    await Appointment.create({
      user: user._id,
      service: legalConsultation._id,
      business: business6._id,
      date: tenDays,
      startTime: '09:00',
      endTime: '10:00',
      status: 'scheduled',
      notes: 'Initial consultation'
    });

    // Twelve days from now
    const twelveDays = new Date();
    twelveDays.setDate(twelveDays.getDate() + 12);
    twelveDays.setHours(14, 30, 0, 0);

    await Appointment.create({
      user: user._id,
      service: oilChange._id,
      business: business7._id,
      date: twelveDays,
      startTime: '14:30',
      endTime: '15:00',
      status: 'scheduled',
      notes: 'Regular maintenance'
    });

    console.log('Created appointments');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 