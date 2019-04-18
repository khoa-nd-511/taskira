const { userLoader, ticketLoader, commentLoader } = require('./loaders');

const queryTickets = async ticketIds => {
  try {
    const tickets = await ticketLoader.loadMany(ticketIds);

    return tickets
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

const queryComments = async commentIds => {
  try {
    const comments = await commentLoader.loadMany(commentIds);

    return comments;
  } catch (error) {

  }
}

const mapTicketData = ticketData => {
  if (ticketData.assignee) {
    return {
      ...ticketData._doc,
      _id: ticketData._id,
      creator: queryUser.bind(this, ticketData._doc.creator.toString()),
      assignee: queryUser.bind(this, ticketData._doc.assignee.toString()),
      comments: queryComments.bind(this, ticketData.comments)
    }
  }

  return {
    ...ticketData._doc,
    _id: ticketData._id,
    creator: queryUser.bind(this, ticketData._doc.creator.toString()),
    comments: queryComments.bind(this, ticketData.comments)
  }
}

const mapUserData = userData => {
  return {
    ...userData._doc,
    _id: userData._doc._id,
    createdTickets: queryTickets.bind(this, userData.createdTickets),
    assignedTickets: queryTickets.bind(this, userData.assignedTickets),
    comments: queryComments.bind(this, userData.comments)
  }
}

const mapCommentData = commentData => {
  return {
    ...commentData,
    user: queryUser.bind(this, commentData.user.toString()),
    ticket: queryTickets.bind(this, [commentData.ticket.toString()]),
  }
}

exports.queryUser = queryUser;
exports.mapUserData = mapUserData;
exports.mapTicketData = mapTicketData;
exports.mapCommentData = mapCommentData;