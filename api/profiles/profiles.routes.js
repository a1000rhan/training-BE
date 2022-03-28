const express = require("express");
const passport = require("passport");
const { fetchProfile } = require("./profiles.controllers");
const router = express.Router();
router.get("/", passport.authenticate("jwt", { session: false }), fetchProfile);

module.exports = router;
