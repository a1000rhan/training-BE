const User = require("../../db/models/User");
const Profile = require("../../db/models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRATION_MS,
  RESET_PASSWORD_KEY,
} = require("../../config/keys");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox6f885200a77b400abf77388f6c5bfeea.mailgun.org";
const apiKey = "key-3122a15d86e011be85434a122db8c791";
const mg = mailgun({ apiKey: apiKey, domain: DOMAIN });
const _ = require("lodash");
const path = require("path");

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    staffId: user.staffId,
    type: user.type,
    exp: Date.now() + JWT_EXPIRATION_MS,
  };

  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ staffId: req.body.staffId });
    if (!user.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
      const newUser = await User.findOneAndUpdate(
        { staffId: req.body.staffId },
        { password: req.body.password, type: req.body.type },
        { new: true }
      );
      const token = generateToken(newUser);
      res.status(201).json({ token });
    } else {
      res.status(401).json({ Message: "You have signed up before" });
    }
  } catch (error) {
    next(error);
  }
};

exports.signinUser = (req, res, next) => {
  const token = generateToken(req.user);
  res.status(201).json({ token });
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (newUser.type === "student") {
      const newProfile = await Profile.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        owner: newUser._id,
      });
    }
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "user with this email does not exists !" });
    }

    const token = jwt.sign({ _id: user._id }, RESET_PASSWORD_KEY, {
      expiresIn: "1d",
    });
    // const RL = "exp://192.168.9.172:19000/--/hh://reset";
    const data = {
      from: "noreply@helping-hand.com",
      to: email,
      subject: "Reset Password Link",
      html: `<h2>Please copy your token then click on the below link to reset your password !</h2>
      <h2>Your Click the following link to reset Password: ${token}</h2>
    
        <a href="exp://192.168.9.172:19000/--/hh://reset">
          Click Here To Reset!
        </a>
      `,
    };
    // console.log(
    //   "🚀 ~ file: users.controller.js ~ line 67 ~ User.findOne ~ ${token}",
    //   { token }
    // );

    return user.updateOne({ resetLink: token }, function (error, success) {
      if (error) {
        return res.status(400).json({ error: "reset password link error" });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({ error: error.message });
          }

          return res.json({
            message: "Email has been sent, kindly follow the instruction",
          });
        });
      }
    });
  });
};
exports.resetPassword = (req, res) => {
  const { newPass, resetLink } = req.body;
  console.log(
    "🚀 ~ file: users.controller.js ~ line 90 ~ resetLink",
    resetLink
  );
  if (resetLink) {
    jwt.verify(resetLink, RESET_PASSWORD_KEY, function (error, decode) {
      console.log("🚀 ~ file: users.controller.js ~ line 99 ~ decode", decode);
      if (error) {
        return res.status(401).json({
          error: "Incorrect token or it's expired",
        });
      }
      User.findOne({ resetLink }, async (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "User with this token does not exists !" });
        }
        const hashedNewPassword = await bcrypt.hash(newPass, 10);

        const obj = {
          password: hashedNewPassword,
        };

        user = _.extend(user, obj);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: "reset password error" });
          } else {
            return res
              .status(200)
              .json({ message: "Your password has been changed" });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Authentication Error !" });
  }
};
