const Profile = require("../../db/models/Profile");
exports.fetchProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ owner: req.user._id });
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
exports.fetchProfiles = async (req, res, next) => {
  try {
    if (req.user.type === "admin") {
      const profiles = await Profile.find({ $concatArrays: ["students"] })
        .where("courses.profileStatus")
        .equals("pending")
        .populate("courses.courseId");

      res.status(200).json(profiles);
    } else res.status(401).json({ message: "You are not authorized" });
  } catch (error) {
    next(error);
  }
};
