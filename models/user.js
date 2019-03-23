const jwt = require('jsonwebtoken');
const config = require('config');
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

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, email: this.email }, config.get('jwtPrivateKey'));
}

module.exports = mongoose.model('User', userSchema);