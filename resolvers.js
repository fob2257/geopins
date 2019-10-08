const { AuthenticationError, PubSub } = require('apollo-server');

const Pin = require('./models/Pin');

const pubSub = new PubSub();

const constants = {
  PIN_ADDED: 'PIN_ADDED',
  PIN_DELETED: 'PIN_DELETED',
  PIN_UPDATED: 'PIN_UPDATED',
};

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) throw new AuthenticationError('you must be logged in');

  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate('author')
        .populate('comments.author')
        .exec();

      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();

      const pinAdded = await Pin.populate(newPin, ['author', 'comments.author']);

      pubSub.publish(constants.PIN_ADDED, { pinAdded });

      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId, author: ctx.currentUser._id }).exec();

      pubSub.publish(constants.PIN_DELETED, { pinDeleted });

      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const pinUpdated = await Pin.findByIdAndUpdate({ _id: args.pinId }, {
        $push: {
          comments: {
            text: args.text,
            author: ctx.currentUser._id,
          },
        },
      }, { new: true })
        .populate('author')
        .populate('comments.author')
        .exec();

      pubSub.publish(constants.PIN_UPDATED, { pinUpdated });

      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator(constants.PIN_ADDED),
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator(constants.PIN_DELETED),
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator(constants.PIN_UPDATED),
    },
  },
};
