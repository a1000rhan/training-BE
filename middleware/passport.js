const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../db/models/User");
const { JWT_SECRET } = require("../config/keys");

exports.localStrategy = new LocalStrategy(
  {
    usernameField: "staffId",
  },
  async (staffId, password, done) => {
    try {
      const user = await User.findOne({ staffId: staffId });
      console.log(user);
      // );
      const passwordsMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;

      // const passwordsMatch2 = maid
      //   ? await bcrypt.compare(password, maid.password)
      //   : false;
      // console.log(
      //   "🚀 ~ file: passport.js ~ line 22 ~ exports.localStrategy=newLocalStrategy ~ passwordsMatch2",
      //   passwordsMatch2
      // );

      if (passwordsMatch) return done(null, user);
      // if (passwordsMatch2) return done(null, maid);

      return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    if (Date.now() > payload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findById(payload._id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
