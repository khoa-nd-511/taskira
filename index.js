const express = require('express');
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose');
const config = require('config');

const schema = require('./graphql/schema');
const rootResolver = require('./graphql/resolver');
const isAuth = require('./middleware/auth')

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR!!! jwtPrivateKey is not defined.')
  process.exit(1)
}

const app = express();

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true
}))

const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb+srv://khoa_admin:${process.env.MONGO_PWD}@khoadev-qgt4c.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, {
  useNewUrlParser: true
}).then(() => app.listen(PORT)).catch(err => console.log(err))
