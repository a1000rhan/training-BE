const express = require("express");
const passport = require("passport");
const {
  fetchRequests,
  approveCourse,
  rejectRequest,
  fetchAllRequests,
} = require("./requests.controllers");
const router = express.Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  fetchRequests
);
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  fetchAllRequests
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
