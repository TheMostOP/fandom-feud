const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const AnswerSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  response: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  answerer: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AnswerSchema.statics.toAPI = (doc) => ({
  prompt: doc.prompt,
  response: doc.response,
});

const AnswerModel = mongoose.model('Answer', AnswerSchema);

module.exports = AnswerModel;
