const { model, Schema, mongoose } = require("mongoose");

const ProfileSchema = Schema({
  firstName: { type: String, require: true },
  lastName: { type: String },
  image: { type: String },
  courses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      profileStatus: "",
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  staffId: {
    type: String,
  },
});

module.exports = model("Profile", ProfileSchema);
