const { model, Schema, mongoose } = require("mongoose");

const CourseSchema = Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String },
});

module.exports = model("Course", CourseSchema);
