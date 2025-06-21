const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    throw new Error('Server configuration error: JWT_SECRET is not set');
  }
  
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('JWT token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('Register request body:', JSON.stringify(req.body));
    
    const { name, email, password, role, phone, address, businessDetails } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        details: {
          name: name ? 'provided' : 'missing',
          email: email ? 'provided' : 'missing',
          password: password ? 'provided' : 'missing'
        }
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with additional fields if provided
    const userData = {
      name,
      email,
      password,
      role: role || 'user',
      isDemo: false
    };

    // Add optional fields if provided
    if (phone) userData.phone = phone;
    if (address) userData.address = address;
    if (businessDetails && role === 'business') userData.businessDetails = businessDetails;

    console.log('Creating user with data:', {
      name: userData.name,
      email: userData.email,
      role: userData.role
    });

    const user = await User.create(userData);

    if (user) {
      // If business user, create default availability
      if (role === 'business') {
        const Availability = require('../models/Availability');
        
        // Create default availability for all days of the week
        // Sunday (0)
        await Availability.create({
          businessId: user._id,
          dayOfWeek: 0,
          startTime: '10:00',
          endTime: '15:00',
          isAvailable: true
        });
        
        // Monday to Friday (1-5)
        for (let day = 1; day <= 5; day++) {
          await Availability.create({
            businessId: user._id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true
          });
        }
        
        // Saturday (6)
        await Availability.create({
          businessId: user._id,
          dayOfWeek: 6,
          startTime: '10:00',
          endTime: '15:00',
          isAvailable: true
        });
      }
      
      try {
        const token = generateToken(user._id);
        
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          businessDetails: user.businessDetails,
          token: token,
        });
      } catch (tokenError) {
        console.error('Token generation error during registration:', tokenError);
        // User was created but token generation failed
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          businessDetails: user.businessDetails,
          error: 'Authentication token could not be generated. Please log in again.'
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      try {
        const token = generateToken(user._id);
        
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
        });
      } catch (tokenError) {
        console.error('Token generation error during login:', tokenError);
        res.status(500).json({ 
          message: 'Authentication error: Could not generate token',
          details: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
        });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to ensure business users have availability set up
const ensureBusinessAvailability = async (userId) => {
  try {
    const Availability = require('../models/Availability');
    
    // Check if this business already has availability
    const existingAvailability = await Availability.findOne({ businessId: userId });
    
    // If no availability exists, create default
    if (!existingAvailability) {
      console.log(`Creating default availability for business user: ${userId}`);
      
      // Sunday (0)
      await Availability.create({
        businessId: userId,
        dayOfWeek: 0,
        startTime: '10:00',
        endTime: '15:00',
        isAvailable: true
      });
      
      // Monday to Friday (1-5)
      for (let day = 1; day <= 5; day++) {
        await Availability.create({
          businessId: userId,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true
        });
      }
      
      // Saturday (6)
      await Availability.create({
        businessId: userId,
        dayOfWeek: 6,
        startTime: '10:00',
        endTime: '15:00',
        isAvailable: true
      });
      
      console.log('Default availability created successfully');
    }
  } catch (error) {
    console.error('Error ensuring business availability:', error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      // If user is a business, ensure they have availability set up
      if (user.role === 'business') {
        await ensureBusinessAvailability(user._id);
      }
      
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all business users
// @route   GET /api/auth/businesses
// @access  Public
const getBusinessUsers = async (req, res) => {
  try {
    const businesses = await User.find({ role: 'business' })
      .select('-password')
      .sort({ name: 1 });
    
    // Ensure all businesses have availability set up
    for (const business of businesses) {
      await ensureBusinessAvailability(business._id);
    }
    
    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getBusinessUsers,
}; 