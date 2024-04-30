const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const TopAnswerSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    set: setName,
  },
  response: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  // votes are indexed at 0
  votes: {
    type: Number,
    min: 0,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TopAnswerSchema.statics.toAPI = (doc) => ({
  prompt: doc.prompt,
  response: doc.response,
  votes: doc.votes,
});

const TopAnswerModel = mongoose.model('TopAnswer', TopAnswerSchema);
module.exports = TopAnswerModel;
