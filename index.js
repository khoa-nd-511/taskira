const express = require('express');
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Fawn = require('fawn');

const Ticket = require('./models/ticket');
const User = require('./models/user');

Fawn.init(mongoose);

const queryUser = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdTickets: queryTickets.bind(this, user._doc.createdTickets)
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const queryTickets = async ticketIds => {
  try {
    const tickets = await Ticket.find({ _id: { $in: ticketIds } });
    return tickets.map(t => {
      return {
        ...t._doc,
        creator: queryUser.bind(this, t.creator)
      }
    })
  } catch (error) {
    console.log(error);
    throw error
  }
};

const schema = buildSchema(`
  type Ticket {
    _id: ID!
    title: String!
    description: String!
    hiPri: Boolean!
    label: String!
    creator: User!
    assignee: User!
    createdDate: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdTickets: [Ticket!]!
    assignedTickets: [Ticket!]!
  }

  input TicketInput {
    title: String!
    description: String!
    hiPri: Boolean!
    label: String!
    creator: String!
    createdDate: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    getTickets: [Ticket!]!
    getUser: User!
  }

  type RootMutation {
    createTicket(ticketInput: TicketInput): Ticket
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

const root = {
  createTicket: async args => {
    try {
      const ticket = new Ticket({
        title: args.ticketInput.title,
        description: args.ticketInput.description,
        hiPri: args.ticketInput.hiPri,
        creator: "5c9112d589672c6198abb298",
        label: args.ticketInput.label,
        createdDate: new Date(args.ticketInput.createdDate)
      });

      new Fawn.Task()
        .save('tickets', ticket)
        .update('users', { _id: ticket.creator }, {
          $push: { createdTickets: ticket._id }
        })
        .run();
      return {
        ...ticket._doc,
        creator: queryUser.bind(this, ticket._doc.creator)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async args => {
    try {
      const oldUser = await User.findOne({ email: args.userInput.email });
      if (!oldUser) {
        const hashedPwd = await bcrypt.hash(args.userInput.password, 12);
        const userObj = new User({
          email: args.userInput.email,
          password: hashedPwd
        });
        const newUser = await userObj.save();
        return newUser;
      } else throw new Error("User exists");
    } catch (error) {
      throw error;
    }
  },
  getTickets: async () => {
    try {
      const tickets = await Ticket.find();
      return tickets.map(t => {
        return {
          ...t._doc,
          creator: queryUser.bind(this, t._doc.creator)
        }
      })
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb+srv://khoa_admin:${process.env.MONGO_PWD}@khoadev-qgt4c.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, {
  useNewUrlParser: true
}).then(() => app.listen(PORT)).catch(err => console.log(err))
