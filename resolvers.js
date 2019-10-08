const { AuthenticationError } = require('apollo-server');

const Pin = require('./models/Pin');

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) throw new AuthenticationError('you must be logged in');

  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();

      const pinAdded = await Pin.populate(newPin, ['author', 'comments.author']);

      return pinAdded;
    }),
  },
};
