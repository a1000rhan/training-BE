const express = require("express");
const passport = require("passport");
const {
  createCourse,
  getCourses,
  joinCourse,
  deleteCourse,
  approveCourse,
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
router.get("/", passport.authenticate("jwt", { session: false }), getCourses);
router.delete(
  "/:courseId",
  passport.authenticate("jwt", { session: false }),
  deleteCourse
);
router.put(
  "/:profileId",
  pas - sport.authenticate("jwt", { session: false }),
  approveCourse
);
module.exports = router;
