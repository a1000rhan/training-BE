const Course = require("../../db/models/Course");
const Profile = require("../../db/models/Profile");
const Request = require("../../db/models/Request");
exports.fetchRequests = async (req, res, next) => {
  try {
    if (req.user.type === "admin") {
      const requests = await Request.find()
        .where("status")
        .equals("pending")
        .populate("user", "_id staffId")
        .populate("course", "time date title");
      res.status(200).json(requests);
    } else res.status(401).json({ message: "You are not authorized" });
  } catch (error) {
    next(error);
  }
};
exports.fetchAllRequests = async (req, res, next) => {
  try {
    if (req.user.type === "admin") {
      const requests = await Request.find()
        .populate("user", "_id staffId")
        .populate("course", "time date title");
      res.status(200).json(requests);
    } else res.status(401).json({ message: "You are not authorized" });
  } catch (error) {
    next(error);
  }
};
exports.approveCourse = async (req, res, next) => {
  try {
    const { reqId } = req.params;
    if (req.user.type === "admin") {
      const checkReq = await Request.findById(reqId);
      if (checkReq.status === "pending") {
        const request = await Request.findByIdAndUpdate(
          { _id: reqId },
          { status: "approved" }
        );

        const updatedProfile = await Profile.findOneAndUpdate(
          { owner: request.user },
          { $push: { courses: request.course } },
          { new: true, runValidators: true }
        );

        const updatedCourse = await Course.findByIdAndUpdate(
          { _id: request.course },
          { $inc: { maxSeats: -1 }, $push: { students: updatedProfile._id } },
          { new: true, runValidators: true }
        );

        res.status(200).json(updatedCourse);
      } else res.status(404).json({ message: "This request is not pending" });
    } else res.status(401).json({ message: "You are not authorized" });
  } catch (error) {
    next(error);
  }
};
exports.rejectRequest = async (req, res, next) => {
  try {
    const { reqId } = req.params;
    const requestCheck = await Request.findById(reqId);
    if (requestCheck.status !== "Rejected") {
      const request = await Request.findByIdAndUpdate(
        { _id: reqId },
        { status: "Rejected" },
        { new: true, runValidators: true }
      );
      res.status(200).json(request);
    } else res.status(404).json({ message: "The request is already rejected" });
  } catch (error) {
    next(error);
  }
};
