const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hiPri: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ready, inprogress', 'review', 'deploy', 'invalid'],
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  updatedDate: {
    type: Date,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Ticket', ticketSchema);