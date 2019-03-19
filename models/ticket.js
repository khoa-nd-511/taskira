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
  createdDate: {
    type: Date,
    required: true
  },
  label: {
    type: String,
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
});

module.exports = mongoose.model('Ticket', ticketSchema);