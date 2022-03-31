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
// if (req.user.type === "admin") {
//     const requests = await Request.find({ $concatArrays: ["students"] })
//       .where("courses.profileStatus")
//       .equals("pending")
//       .populate("courses.courseId");
exports.approveCourse = async (req, res, next) => {
  try {
    const { reqId } = req.params;
    const request = await Request.findByIdAndUpdate(
      { _id: reqId },
      { status: "approved" }
    );

    const updatedProfile = await Profile.findOneAndUpdate(
      { owner: request.user },
      { $push: { courses: req.body.course } },
      { new: true, runValidators: true }
    );
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: request.course },
      { maxSeats: updatedProfile._id },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
