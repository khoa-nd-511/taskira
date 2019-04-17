const mongoose = require('mongoose');
const Fawn = require('fawn');

const assigningResolver = require('./assigning');
const userResolver = require('./user');
const ticketResolver = require('./ticket');
const commentResolver = require('./comment');

Fawn.init(mongoose);

const rootResolver = {
  ...assigningResolver,
  ...userResolver,
  ...ticketResolver,
  ...commentResolver,
};

module.exports = rootResolver;