const express = require('express');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a resource
router.get('/resource/:resourceId', async (req, res) => {
  try {
    const comments = await Comment.find({ resource: req.params.resourceId })
      .populate('author', 'name email')
      .populate('parentComment')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, resourceId, parentCommentId } = req.body;
    
    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    const comment = new Comment({
      content,
      author: req.user.id,
      resource: resourceId,
      parentComment: parentCommentId || null
    });
    
    await comment.save();
    await comment.populate('author', 'name email');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = req.body.content || comment.content;
    await comment.save();
    await comment.populate('author', 'name email');
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const likeIndex = comment.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user.id);
    }
    
    await comment.save();
    await comment.populate('author', 'name email');
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

