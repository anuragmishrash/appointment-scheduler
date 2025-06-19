const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Business
const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    
    const service = await Service.create({
      businessId: req.user._id,
      name,
      description,
      duration,
      price
    });
    
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all services for a business
// @route   GET /api/services/business/:businessId
// @access  Public
const getBusinessServices = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const services = await Service.find({
      businessId,
      active: true
    });
    
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Business
const updateService = async (req, res) => {
  try {
    const { name, description, duration, price, active } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user is authorized to update this service
    if (service.businessId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update service fields
    service.name = name || service.name;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.active = active !== undefined ? active : service.active;
    
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Business
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user is authorized to delete this service
    if (service.businessId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Instead of deleting, set to inactive
    service.active = false;
    await service.save();
    
    res.json({ message: 'Service removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createService,
  getBusinessServices,
  getServiceById,
  updateService,
  deleteService
}; 