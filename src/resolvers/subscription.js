const Subscription = {
  newUser: {
    subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(['user-added'])
  },
  newTour: {
    subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(['tour-added'])
  },
};

export default Subscription;
