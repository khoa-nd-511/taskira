const Fawn = require('fawn');
const { mapTicketData } = require('../shared_fn/mergeQueries');
const { queryUser } = require('../shared_fn/mergeQueries');

const Ticket = require('../../models/ticket');

module.exports = {
  createTicket: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    try {
      const ticket = new Ticket({
        title: args.ticketInput.title,
        description: args.ticketInput.description,
        hiPri: args.ticketInput.hiPri,
        creator: req.userId,
        label: args.ticketInput.label,
        status: 'ready',
        createdDate: new Date(args.ticketInput.createdDate),
        updatedDate: new Date(args.ticketInput.createdDate)
      });

      await new Fawn.Task()
        .save('tickets', ticket)
        .update('users', { _id: ticket.creator }, {
          $push: { createdTickets: ticket._id }
        })
        .run();

      return {
        ...ticket._doc,
        creator: queryUser.bind(this, ticket.creator.toString())
      };

    } catch (err) {
      throw err;
    }
  },

  getTickets: async () => {
    try {
      const tickets = await Ticket.find();

      return tickets.map(t => mapTicketData(t));

    } catch (err) {
      throw err;
    }
  },

  getTicket: async ({ ticketId }) => {
    try {
      const ticket = await Ticket.findOne({ _id: ticketId });

      return mapTicketData(ticket);

    } catch (err) {
      throw err;
    }
  },

  updateStatus: async ({ ticketId, status }) => {
    try {
      let newStatus = '';

      switch (status) {
        case 'ready':
          newStatus = 'inprogress'
          break;
        case 'inprogress':
          newStatus = 'review'
          break;
        case 'review':
          newStatus = 'deploy'
          break;
        case 'deploy':
          newStatus = 'resolved'
          break;
        case 'resolved':
          newStatus = 'resolved'
          break;
        case 'invalid':
          newStatus = 'invalid'
          break;
        default:
          newStatus = 'ready'
          break;
      }

      await Ticket.findOneAndUpdate({ _id: ticketId }, {
        $set: {
          status: newStatus,
          updatedDate: new Date()
        }
      });

      return { status: newStatus, updatedDate: new Date() };
    } catch (error) {
      throw error;
    }
  }
};