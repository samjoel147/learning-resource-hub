const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all resources with filters and search
router.get('/', async (req, res) => {
  try {
    const { category, tags, search, author, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    
    const query = { isPublic: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    // Filter by author
    if (author) {
      query.author = author;
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const resources = await Resource.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Resource.countDocuments(query);
    
    res.json({
      resources,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalResources: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('author', 'name email')
      .populate('ratings.user', 'name');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment views
    resource.views += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create resource
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, content, category, tags, fileUrl, isPublic } = req.body;
    
    const resource = new Resource({
      title,
      description,
      content,
      category,
      tags: tags || [],
      author: req.user.id,
      fileUrl,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await resource.save();
    await resource.populate('author', 'name email');
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update resource
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the author
    if (resource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }
    
    const { title, description, content, category, tags, fileUrl, isPublic } = req.body;
    
    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.content = content || resource.content;
    resource.category = category || resource.category;
    resource.tags = tags || resource.tags;
    resource.fileUrl = fileUrl !== undefined ? fileUrl : resource.fileUrl;
    resource.isPublic = isPublic !== undefined ? isPublic : resource.isPublic;
    
    await resource.save();
    await resource.populate('author', 'name email');
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the author
    if (resource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rate resource
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user already rated
    const existingRatingIndex = resource.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      resource.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      resource.ratings.push({ user: req.user.id, rating });
    }
    
    await resource.save();
    await resource.populate('author', 'name email');
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's resources
router.get('/user/my-resources', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ author: req.user.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

