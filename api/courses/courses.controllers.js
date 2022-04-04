const Course = require("../../db/models/Course");
const Profile = require("../../db/models/Profile");
const Request = require("../../db/models/Request");
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate("owner", "staffId _id")
      .populate("students");
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};
exports.createCourse = async (req, res, next) => {
  try {
    console.log(req.user);
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    console.log(
      "🚀 ~ file: courses.controllers.js ~ line 15 ~ exports.createCourse= ~ req.file",
      req.body
    );
    if (req.user.type === "admin") {
      req.body.owner = req.user._id;
      const newCourse = await Course.create(req.body);
      res.status(200).json(newCourse);
    } else res.status(401).json({ message: "you are not authorized" });
  } catch (error) {
    next(error);
  }
};
exports.joinCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const foundProfile = await Profile.findOne({ owner: req.user._id });
    const userRegistered = await Request.findOne({
      user: req.user._id,
      course: courseId,
    });
    if (!userRegistered) {
      if (course.maxSeats > 0) {
        const request = await Request.create({
          firstName: foundProfile.firstName,
          lastName: foundProfile.lastName,
          course: course._id,
          user: req.user._id,
        });
        res.status(200).json(request);
      }
      // const profile = await Profile.findOneAndUpdate(
      //   { owner: req.user },
      //   {
      //     $push: { courses: { courseId: course, profileStatus: "pending" } },
      //   },
      //   { new: true, runValidators: true }
      // );
      // const updatedCourse = await Course.findOneAndUpdate(
      //   { _id: courseId },
      //   {
      //     maxSeats: course.maxSeats - 1,
      //     $push: { students: profile._id },
      //   },

      //   { new: true, runValidators: true }
      // );
      // res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ message: "you are already in this course" });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (req.user.type === "admin") {
      const course = await Course.findByIdAndDelete(courseId);

      res.status(200).end();
    }
  } catch (error) {
    next(error);
  }
};
exports.updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    if (req.user.type === "admin") {
      const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
        new: true,
      });
      res.status(200).json(updatedCourse);
    }
    res.status(404).json({ message: "You are not an admin" });
  } catch (error) {
    next(error);
  }
};
