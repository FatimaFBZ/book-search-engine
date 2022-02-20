const { AuthenticationError } = require('apollo-server-express');
const {User, Book} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      
      me: async (parent, args, context) => {
        console.log('WE HIT THE ME QUERY!!', context.user)
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('user');
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
    
  Mutation: {
   
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
    savedBook: async (parent, { book }, { user }) => {
        if(user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: book } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } 
        else {
          throw new AuthenticationError("You need to be logged in!");
       
        }
      },
    removeBook: async (parent, { bookId }, { user }) => {
 
        if(user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
       
      },
    },
  };
  module.exports = resolvers;  

