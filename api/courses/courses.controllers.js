const Course = require("../../db/models/Course");
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("owner", "staffId _id");
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};
exports.createCourse = async (req, res, next) => {
  try {
    console.log(req.user);
    if (req.user.type === "admin") {
      req.body.owner = req.user._id;
      const newCourse = await Course.create(req.body);
      res.status(200).json(newCourse);
    } else res.status(401).json({ message: "you are not authorized" });
  } catch (error) {
    next(error);
  }
};
