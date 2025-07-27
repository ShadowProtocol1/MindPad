const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const noteValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 30 }).withMessage('Each tag must be max 30 characters')
];

// GET /api/notes - Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    let query = { user: req.user._id };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    
    if (sortBy === 'title') {
      sortObj.title = sortOrder;
    } else if (sortBy === 'updatedAt') {
      sortObj.updatedAt = sortOrder;
    } else {
      sortObj.createdAt = sortOrder;
    }
    
    // Add pinned notes to the top
    const finalSort = { isPinned: -1, ...sortObj };
    
    const notes = await Note.find(query)
      .sort(finalSort)
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    const total = await Note.countDocuments(query);
    
    res.json({
      notes,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

// GET /api/notes/:id - Get a specific note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error while fetching note' });
  }
});

// POST /api/notes - Create a new note
router.post('/', noteValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    
    const { title, content, color = '#ffffff', tags = [], isPinned = false } = req.body;
    
    const note = new Note({
      title,
      content,
      color,
      tags,
      isPinned,
      user: req.user._id
    });
    
    await note.save();
    
    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', noteValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    
    const { title, content, color, tags, isPinned } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        title, 
        content, 
        color, 
        tags, 
        isPinned,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error while updating note' });
  }
});

// PATCH /api/notes/:id/pin - Toggle pin status
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.isPinned = !note.isPinned;
    await note.save();
    
    res.json({
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note
    });
  } catch (error) {
    console.error('Pin note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error while updating note' });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

// GET /api/notes/stats/summary - Get user's notes statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Note.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          pinnedNotes: {
            $sum: { $cond: [{ $eq: ['$isPinned', true] }, 1, 0] }
          },
          totalTags: { $sum: { $size: '$tags' } }
        }
      }
    ]);
    
    const summary = stats[0] || {
      totalNotes: 0,
      pinnedNotes: 0,
      totalTags: 0
    };
    
    res.json({ stats: summary });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;
