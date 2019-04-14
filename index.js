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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
})

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true
}))

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(`mongodb://taskira_db:dangkhoa95@ds139896.mlab.com:39896/taskira`, {
      useNewUrlParser: true
    });
  } catch (error) {
    console.log(error)
  }
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
  });
}

startServer();