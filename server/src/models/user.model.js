const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  profilePie: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
const UserModel = model("User", UserSchema);

module.exports = UserModel;
