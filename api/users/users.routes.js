const express = require("express");
const passport = require("passport");
const {
  signupUser,
  signinUser,
  forgotPassword,
  resetPassword,
  createUser,
} = require("./users.controllers");
const router = express.Router();

router.put("/", signupUser);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signinUser
);
router.post(
  "/create",

  createUser
);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
