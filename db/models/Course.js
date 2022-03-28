const { model, Schema, mongoose } = require("mongoose");

const CourseSchema = Schema({
  date: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Course", CourseSchema);
