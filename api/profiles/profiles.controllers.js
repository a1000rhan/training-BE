const Profile = require("../../db/models/Profile");
exports.fetchProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ owner: req.user._id })
      .populate("courses", "time date title")
      .populate("owner", "staffId");
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
