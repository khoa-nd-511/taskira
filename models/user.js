const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    email: true
  },
  password: {
    type: String,
    required: true
  },
  createdTickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ],
  assignedTickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ],
});

module.exports = mongoose.model('User', userSchema);