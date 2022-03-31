const { model, Schema, mongoose } = require("mongoose");

const ProfileSchema = Schema({
  firstName: { type: String, require: true },
  lastName: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Profile", ProfileSchema);
