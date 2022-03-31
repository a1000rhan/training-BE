const express = require("express");
const passport = require("passport");
const {
  fetchRequests,
  approveCourse,
  rejectRequest,
} = require("./requests.controllers");
const router = express.Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  fetchRequests
);
router.post(
  "/:reqId",
  passport.authenticate("jwt", { session: false }),
  approveCourse
);
router.post(
  "/:reqId/reject",
  passport.authenticate("jwt", { session: false }),
  rejectRequest
);
module.exports = router;
