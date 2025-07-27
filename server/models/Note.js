const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: {
    type: String,
    default: '#ffffff',
    match: /^#[0-9A-F]{6}$/i // Hex color validation
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }]
}, {
  timestamps: true
});

// Index for better search performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
