const { model, Schema, mongoose } = require("mongoose");

const ProfileSchema = Schema({
  firstName: { type: String, require: true },
  lastName: { type: String },
  image: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  staffId: {
    type: String,
  },
});

module.exports = model("Profile", ProfileSchema);
