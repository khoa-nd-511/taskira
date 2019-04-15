const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const { mapUserData } = require('../shared_fn/mergeQueries');

module.exports = {
  createUser: async (args, req) => {
    // if (!req.isAuth) throw new Error("Unauthenticated");

    try {
      const oldUser = await User.findOne({ email: args.userInput.email });
      if (oldUser) throw new Error("User exists");

      const hashedPwd = await bcrypt.hash(args.userInput.password, 12);
      const userObj = new User({
        ...args.userInput,
        password: hashedPwd
      });

      const newUser = await userObj.save();

      return {
        ...newUser._doc,
        token: newUser.generateAuthToken()
      };

    } catch (error) {
      throw error;
    }
  },

  signIn: async args => {
    try {
      const { email, password } = args;

      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const pwdMatch = await bcrypt.compare(password, user.password);
      if (!pwdMatch) throw new Error("Password doesn't match");

      return {
        userId: user._id,
        token: user.generateAuthToken()
      }

    } catch (err) {
      throw err;
    }
  },

  searchUsers: async ({ text }) => {
    try {
      if (text === '') return [];

      const regexPattern = new RegExp(`.*${text}`, 'gi');
      const foundUsers = await User.find({ email: { $regex: regexPattern } });

      return foundUsers.map(u => mapUserData(u));
    } catch (error) {
      throw error;
    }
  }
};