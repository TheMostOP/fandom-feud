const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const AnswerSchema = new mongoose.Schema({
  favShow: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  favBook: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  favMovie: {
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
  favShow: doc.favShow,
  favBook: doc.favBook,
  favMovie: doc.favMovie,
});

const AnswerModel = mongoose.model('Answer', AnswerSchema);

module.exports = AnswerModel;
