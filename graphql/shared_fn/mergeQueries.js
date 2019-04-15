const { userLoader, ticketLoader } = require('./loaders');

const queryTickets = async ticketIds => {
  try {
    const tickets = await ticketLoader.loadMany(ticketIds);

    return ticketIds.map(id => mapTicketData(tickets[id]))
  } catch (error) {
    throw error
  }
}

const queryUser = async userId => {
  try {
    const user = await userLoader.load(userId);

    return mapUserData(user);
  } catch (err) {
    throw err;
  }
}

const mapTicketData = ticketData => {
  if (ticketData.assignee) {
    return {
      ...ticketData._doc,
      _id: ticketData._id,
      creator: queryUser.bind(this, ticketData._doc.creator.toString()),
      assignee: queryUser.bind(this, ticketData._doc.assignee.toString())
    }
  }

  return {
    ...ticketData._doc,
    _id: ticketData._id,
    creator: queryUser.bind(this, ticketData._doc.creator.toString()),
  }
}

const mapUserData = userData => {
  return {
    ...userData._doc,
    _id: userData._doc._id,
    createdTickets: queryTickets.bind(this, userData.createdTickets),
    assignedTickets: queryTickets.bind(this, userData.assignedTickets)
  }
}

exports.queryUser = queryUser;
exports.mapUserData = mapUserData;
exports.mapTicketData = mapTicketData;