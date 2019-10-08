require('dotenv').config();
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const { findOrCreateUser } = require('./controllers/user.controller');

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(error => console.error(error));

const context = async ({ req, connection }) => {
  if (connection) return connection.context;

  let currentUser = null;
  const authToken = (req.headers.authorization) ? req.headers.authorization : null;

  try {
    if (authToken) {
      currentUser = await findOrCreateUser(authToken);
    }
  } catch (error) {
    console.error(`Unable to authenticate user with token ${authToken}`)
  }

  return { currentUser };
};

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
});

server.listen({ port }).then(({ url }) => console.log(`Server listening on ${url}`));
