const User = require('../../models/user');
const Ticket = require('../../models/ticket');
const Comment = require('../../models/comment');
const DataLoader = require('dataloader');

const ticketLoader = new DataLoader(ticketIds => {
  return Ticket.find({ _id: { $in: ticketIds } })
});

const userLoader = new DataLoader(async userIds => {
  const batchedUserData = await User.find({ _id: { $in: userIds } });

  const sortedData = {};
  batchedUserData.forEach(u => {
    sortedData[u._id] = u;
  });

  return userIds.map(id => sortedData[id]);
});

const commentLoader = new DataLoader(async commentIds => {
  return Comment.find({ _id: { $in: commentIds } })
})

module.exports = {
  ticketLoader,
  userLoader,
  commentLoader
}