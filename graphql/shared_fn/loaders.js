const User = require('../../models/user');
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

module.exports = {
  ticketLoader,
  userLoader
}