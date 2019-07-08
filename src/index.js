import 'dotenv/config';
import '@babel/polyfill';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { ApolloServer, PubSub } from 'apollo-server-express';
import boom from 'express-boom';
import schema from './schema';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken';
import User from './models/User';

const APP_PORT = process.env.PORT || 8080;
const DEBUG_MODE = process.env.DEBUG_MODE || false;
const APP_MONGO_URI = process.env.APP_MONGO_URI;
const APP_JWT_SECRET = process.env.APP_JWT_SECRET;
const app = express();

// Using boom http-friendly messages
app.use(boom());

// Creating a new PubSub instance
const pubsub = new PubSub();

// Added schema definitions and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: DEBUG_MODE,
  playground: DEBUG_MODE,
  context: async ({ req, connection }) => {
    let currentUser;
    let userType;
    const token = req ? req.headers.authorization : connection.context.Authorization;
    if (token) {
      currentUser = jwt.verify(token, APP_JWT_SECRET);
      const { userId } = currentUser;
      const { type } = await User.findOne({ _id: userId }).exec();
      userType = type;
    }
    return { ...req, currentUser, userType, pubsub };
  },
});
// `applyMiddleware`: Allow middleware mounted on the same path
server.applyMiddleware({ app });

// Added middlewares for parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handler for root path
app.get('/', (req, res) => res.status(200).json({
  statusCode: 200,
  message: 'Welcome to Bedu Travels API'
}));

// Route handler for 404
app.use('*', (req, res) => res.boom.notFound());

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer); // Added subscription handler for create Web Socket

// Connecting to Mongo DB
mongoose.connect(APP_MONGO_URI, { useNewUrlParser: true }).then(() => {
  httpServer.listen({ port: APP_PORT }, () => {
    console.log(`GraphQL API Service: 0.0.0.0:${APP_PORT}/graphql`);
    console.log(`Mongo DB Service: ${APP_MONGO_URI}`);
  });
}).catch(err => {
  throw new Error(err)
});
