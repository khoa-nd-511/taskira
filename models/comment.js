const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  createdDate: {
    type: Date,
    required: true
  },
  updatedDate: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('Comment', commentSchema);