const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const DataLoader = require('dataloader');

Fawn.init(mongoose);

const ticketLoader = new DataLoader((ticketIds) => {
  return queryTickets(ticketIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } })
})

const Ticket = require('../../models/ticket');
const User = require('../../models/user');

const mapTicketData = (ticketData) => {
  let mappedTicketData = null;

  mappedTicketData = {
    ...ticketData._doc,
    _id: ticketData._id,
    creator: queryUser.bind(this, ticketData.creator.toString()),
  };

  if (mappedTicketData.assignee !== undefined) {
    mappedTicketData['assignee'] = queryUser.bind(this, ticketData.assignee.toString());
  };

  return mappedTicketData;
};

const mapUserData = (userData) => {
  return {
    ...userData._doc,
    createdTickets: () => ticketLoader.loadMany(userData.createdTickets),
    assignedTickets: () => ticketLoader.loadMany(userData.assignedTickets)
  };
}

const queryUser = async userId => {
  try {

    const user = await userLoader.load(userId.toString());

    return mapUserData(user);

  } catch (err) {
    throw err;
  }
};

const queryTickets = async ticketIds => {
  try {

    const tickets = await Ticket.find({ _id: { $in: ticketIds } });

    return tickets.map(t => mapTicketData(t));

  } catch (error) {
    throw error
  }
};

const resolver = {
  createTicket: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");
    try {

      const ticket = new Ticket({
        title: args.ticketInput.title,
        description: args.ticketInput.description,
        hiPri: args.ticketInput.hiPri,
        creator: req.userId,
        label: args.ticketInput.label,
        createdDate: new Date(args.ticketInput.createdDate)
      });

      await new Fawn.Task()
        .save('tickets', ticket)
        .update('users', { _id: ticket.creator }, {
          $push: { createdTickets: ticket._id }
        })
        .run();

      return {
        ...ticket._doc,
        creator: queryUser(ticket.creator)
      };

    } catch (err) {
      throw err;
    }
  },

  createUser: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");

    try {

      const oldUser = await User.findOne({ email: args.userInput.email });
      if (oldUser) throw new Error("User exists");

      const hashedPwd = await bcrypt.hash(args.userInput.password, 12);
      const userObj = new User({
        ...args.userInput,
        password: hashedPwd
      });

      const newUser = await userObj.save();

      return {
        ...newUser._doc,
        token: newUser.generateAuthToken()
      };

    } catch (error) {
      throw error;
    }
  },

  signIn: async args => {
    try {

      const { email, password } = args;

      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found")

      const pwdMatch = await bcrypt.compare(password, user.password);
      if (!pwdMatch) throw new Error("Password doesn't match");

      return {
        userId: user._id,
        token: user.generateAuthToken()
      }

    } catch (err) {
      throw err;
    }
  },

  getTickets: async () => {
    try {

      const tickets = await Ticket.find();

      return tickets.map(t =>  mapTicketData(t));

    } catch (err) {
      throw err;
    }
  },

  getTicket: async ({ ticketId }) => {
    try {

      return await ticketLoader.load(ticketId);

    } catch (err) {
      throw err;
    }
  },

  assignTicket: async ({ userEmail, ticketId }, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");

    try {

      const user = User.findOne({ email: userEmail });
      const ticket = Ticket.findById(ticketId);

      const metaData = await Promise.all([user, ticket]);
      const [userData, ticketData] = metaData;

      await new Fawn.Task()
        .update('tickets', { _id: ticketData._id }, {
          $push: { assignee: userData._id }
        })
        .update('users', { _id: userData._id }, {
          $push: { assignedTickets: ticketData._id }
        })

      return {
        ...ticket._doc,
        assignee: queryUser.bind(this, user._id),
        creator: queryUser.bind(this, ticket.creator)
      }

    } catch (err) {
      throw err;
    }
  }
};

module.exports = resolver;