const Fawn = require('fawn');
const { queryUser } = require('../shared_fn/mergeQueries');

const User = require('../../models/user');
const Ticket = require('../../models/ticket');

module.exports = {
  assignTicket: async ({ userEmail, ticketId }, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");

    try {

      const curAssignedUser = User.findOne({ email: userEmail });
      const ticket = Ticket.findById(ticketId);

      const metaData = await Promise.all([curAssignedUser, ticket]);
      const [currUserData, ticketData] = metaData;

      // Return if ticket is already assigned to this user
      if (ticketData.assignee && ((currUserData._id.toString() === ticketData.assignee.toString()))) {
        throw new Error("Already assigned to this user!")
      }

      await new Fawn.Task()
        .update('tickets', { _id: ticketData._id }, {
          $set: {
            assignee: currUserData._id,
            updatedDate: new Date()
          }
        })
        // remove ticket from prev user assignedTickets array
        .update('users', { _id: ticketData.assignee }, {
          $pull: { assignedTickets: ticketData._id }
        })
        // add ticket to curr user assignedTickets array
        .update('users', { _id: currUserData._id }, {
          $push: { assignedTickets: ticketData._id }
        })
        .run()

      return {
        ...ticketData._doc,
        assignee: queryUser.bind(this, currUserData._id.toString()),
        updatedDate: new Date()
      }

    } catch (err) {
      throw err;
    }
  },
};