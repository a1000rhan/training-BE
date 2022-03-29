const express = require("express");
const passport = require("passport");
const { fetchProfile, fetchProfiles } = require("./profiles.controllers");
const router = express.Router();
router.get("/", passport.authenticate("jwt", { session: false }), fetchProfile);
router.get(
  "/allprofiles",
  passport.authenticate("jwt", { session: false }),
  fetchProfiles
);

module.exports = router;
