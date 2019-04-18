const Fawn = require('fawn');

const Comment = require('../../models/comment');
const User = require('../../models/user');
const Ticket = require('../../models/ticket');

module.exports = {
  comment: async ({ ticketId, currentUser, text }) => {
    try {
      const user = User.findById(currentUser)
      const ticket = Ticket.findById(ticketId)

      const metaData = await Promise.all([user, ticket]);
      const [userData, ticketData] = metaData;

      const newComment = new Comment({
        content: text,
        user: currentUser,
        ticket: ticketId,
        createdDate: new Date(),
        updatedDate: new Date(),
      });

      await Fawn.Task()
        .save('comments', newComment)
        .update('tickets', { _id: ticketData._id }, {
          $push: { comments: newComment._id }
        })
        .update('users', { _id: userData._id }, {
          $push: { comments: newComment._id }
        })
        .run()

      return newComment;
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}