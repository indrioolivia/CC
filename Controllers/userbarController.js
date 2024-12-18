// controllers/destinationController.js

const { Op } = require('sequelize');
const Destination = require('../Models/destination'); // Adjust the path as needed

// Get all destinations with optional pagination
exports.getAllDestinations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const destinations = await Destination.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating_avg', 'DESC']]
    });

    const totalPages = Math.ceil(destinations.count / limit);

    res.status(200).json({
      status: 'success',
      message: 'Data destinasi berhasil didapatkan',
      data: {
        destinations: destinations.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalItems: destinations.count
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

// Search destinations with filtering and pagination
exports.searchDestinations = async (req, res) => {
  try {
    const { category, city, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    
    if (category) whereClause.category = category;
    if (city) whereClause.city = { [Op.like]: `%${city}%` };
    
    const offset = (page - 1) * limit;
    const destinations = await Destination.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating_avg', 'DESC']]
    });
    
    const totalPages = Math.ceil(destinations.count / limit);
    
    res.status(200).json({
      status: 'success',
      message: 'Pencarian destinasi berhasil',
      data: {
        destinations: destinations.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalItems: destinations.count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

// Get destinations by category
exports.getDestinationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const destinations = await Destination.findAndCountAll({
      where: { category },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating_avg', 'DESC']]
    });

    const totalPages = Math.ceil(destinations.count / limit);

    res.status(200).json({
      status: 'success',
      message: `Data destinasi kategori ${category} berhasil didapatkan`,
      data: {
        destinations: destinations.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalItems: destinations.count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

// Get destinations by city
exports.getDestinationsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const destinations = await Destination.findAndCountAll({
      where: {
        city: {
          [Op.like]: `%${city}%`
        }
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating_avg', 'DESC']]
    });

    const totalPages = Math.ceil(destinations.count / limit);

    res.json({
      destinations: destinations.rows,
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: destinations.count
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};