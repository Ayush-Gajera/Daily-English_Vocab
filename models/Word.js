const mongoose = require('mongoose');

const wordItemSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  pronunciation: {
    type: String,
    required: true
  },
  sentences: [{
    type: String
  }],
  communicationTip: {
    type: String,
    required: true
  }
}, { _id: false });

const wordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  words: [wordItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Word', wordSchema);
