import User from '../models/User';
import Tour from '../models/Tour';
import mongoose from 'mongoose';

const Query = {
  status: () => 'Welcome to GraphQL',
  users: (_, { page, limit, sort, sortBy }, { currentUser, userType }) => {
    if(!currentUser) {
      throw new Error('Unauthorized');
    }

    // Allowed only for admins
    if (!['admin'].includes(userType)) {
      throw new Error('Unauthorized');
    }

    const skip = (page - 1) * limit;
    return User
      .find()
      .skip(skip)
      .limit(limit)
      .sort({
        [`${sortBy}`]: `${sort}`
      })
      .exec();
  },
  user: async (_, { id }, { currentUser, userType }) => {
    if(!currentUser) {
      throw new Error('Unauthorized');
    }

    // Allowed only for admins
    if (!['admin'].includes(userType)) {
      throw new Error('Unauthorized');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Bad Request: Isn't a ObjectID")
    }
    
    const user = await User.findOne({ _id: id }).exec();
    return user ? user : null;
  },
  tours: (_, { page, limit, type }, { currentUser, userType }) => {
    if (!currentUser) {
      throw new Error('Unauthorized');
    }
    
    // Allowed all users
    if (!['admin', 'agency', 'viewer'].includes(userType)) {
      throw new Error('Unauthorized');
    }

    const filters = {};
    if (type) {
      filters.typeTour = type;
    }

    const skip = (page - 1) * limit;
    return Tour.find(filters).skip(skip).limit(limit).exec();
  },
};

export default Query;
