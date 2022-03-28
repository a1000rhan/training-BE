const { model, Schema, mongoose } = require("mongoose");

const CourseSchema = Schema({
  date: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  categories: [{ type: String }],
  maxSeats: { type: Number, default: 50 },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
});

module.exports = model("Course", CourseSchema);
