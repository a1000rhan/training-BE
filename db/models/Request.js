const { model, Schema, mongoose } = require("mongoose");

const RequestSchema = Schema({
  firstName: { type: String, require: true },
  lastName: { type: String },
  status: { type: String, default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

module.exports = model("Request", RequestSchema);
