const mongoose = require('mongoose');
const Fawn = require('fawn');

const assigningResolver = require('./assigning');
const userResolver = require('./user');
const ticketResolver = require('./ticket');

Fawn.init(mongoose);

const rootResolver = {
  ...assigningResolver,
  ...userResolver,
  ...ticketResolver
};

module.exports = rootResolver;