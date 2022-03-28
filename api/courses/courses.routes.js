const express = require("express");
const passport = require("passport");
const {
  createCourse,
  getCourses,
  joinCourse,
} = require("./courses.controllers");
const router = express.Router();
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createCourse
);
router.post(
  "/:courseId",
  passport.authenticate("jwt", { session: false }),
  joinCourse
);
router.get("/", getCourses);
module.exports = router;
