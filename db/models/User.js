const { model, Schema, mongoose } = require("mongoose");

const UserSchema = Schema({
  staffId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  type: { type: String, required: true }, // student or admin
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },

  resetLink: {
    data: String,
    default: "",
  },
});
module.exports = model("User", UserSchema);
