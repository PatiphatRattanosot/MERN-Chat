const MessageModel = require("../models/message.model");
const UserModel = require("../models/user.model");
const cloudinary = require("../lid/cloudinary");

exports.getUserForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const users = await UserModel.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error while getting user info" });
  }
};
