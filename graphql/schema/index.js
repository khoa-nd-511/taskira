const { buildSchema } = require('graphql')

const schema = buildSchema(`
  type Ticket {
    _id: ID!
    title: String!
    description: String!
    hiPri: Boolean!
    label: String!
    creator: User!
    assignee: User
    createdDate: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdTickets: [Ticket!]!
    assignedTickets: Ticket!
  }

  type AuthData {
    userId: ID!
    token: String!
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
    getTicket(ticketId: ID!): Ticket!
    getUser: User!
    signIn(userInput: UserInput): AuthData!
  }

  type RootMutation {
    createTicket(ticketInput: TicketInput): Ticket
    createUser(userInput: UserInput): User
    assignTicket(userEmail: String, ticketId: ID): Ticket
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

module.exports = schema;