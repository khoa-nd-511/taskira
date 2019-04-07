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
    updatedDate: String!
    comments: [Comment]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    createdTickets: [Ticket!]!
    assignedTickets: [Ticket]!
    comments: [Comment]!
  }

  type Comment {
    _id: ID!
    userId: ID!
    ticketId: ID!
    content: String!
    createdDate: String!
    updatedDate: String!
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
    updatedDate: String!
  }

  input UserInput {
    email: String!
    password: String!
    name: String!
  }

  type RootQuery {
    getTickets: [Ticket!]!
    getTicket(ticketId: ID!): Ticket!
    getUser: User!
    signIn(email: String!, password: String!): AuthData!
    searchUsers(text: String!): [User]!
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