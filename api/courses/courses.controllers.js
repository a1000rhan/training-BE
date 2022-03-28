const Course = require("../../db/models/Course");
const Profile = require("../../db/models/Profile");
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
exports.joinCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId });
    const foundProfile = await Profile.findOne({ owner: req.user._id });
    const foundUserInCourse = course.students.some((student) =>
      student.equals(foundProfile._id)
    );
    if (!foundUserInCourse) {
      if (course.maxSeats > 0) {
        const profile = await Profile.findOneAndUpdate(
          { owner: req.user },
          {
            $push: { courses: { courseId: course, profileStatus: "pending" } },
          },
          { new: true, runValidators: true }
        );
        const updatedCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            maxSeats: course.maxSeats - 1,
            $push: { students: profile._id },
          },

          { new: true, runValidators: true }
        );
        res.status(200).json(updatedCourse);
      }
    } else {
      res.status(200).json({ message: "you are already in this course" });
    }
  } catch (error) {
    next(error);
  }
};
exports.approveCourse = async (req, res, next) => {
  try {
    if (req.user.type === "admin") {
      const { profileId } = req.params;
      const profile = await Profile.findById(profileId);
      const foundCourse = profile.courses.find((course) =>
        course.courseId.equals(req.body.course)
      );
      console.log(
        "🚀 ~ file: courses.controllers.js ~ line 66 ~ exports.approveCourse= ~ foundCourse",
        foundCourse
      );
      if (foundCourse) {
        foundCourse.profileStatus = "approved";
        console.log(
          "🚀 ~ file: courses.controllers.js ~ line 66 ~ exports.approveCourse= ~ foundCourse",
          foundCourse
        );
      }
      const approveCourse = profile.courses.map((course) =>
        course.courseId.equals(req.body.course) ? foundCourse : course
      );
      console.log(
        "🚀 ~ file: courses.controllers.js ~ line 80 ~ exports.approveCourse= ~ approveCourse",
        approveCourse
      );
      const updatedProfile = await Profile.findByIdAndUpdate(
        profileId,
        { courses: approveCourse },
        { new: true }
      );

      // await Course.findByIdAndUpdate(req.body.course);
      res.status(200).json(updatedProfile);
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
