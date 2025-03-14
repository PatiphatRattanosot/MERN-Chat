const MessageModel = require("../models/message.model");
const UserModel = require("../models/user.model");
const cloudinary = require("../lid/cloudinary");
const { getReceiverSocketId, io } = require("../lid/socket");

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

exports.sendMessage = async (req, res) => {
  try {
    const { id: receiveId } = req.params;
    const senderId = req.user._id;
    const { message, image } = req.body;
    if (!receiveId) {
      return res.status(400).json({ message: "Receiver Id is required" });
    }
    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }
    const newMessage = await new MessageModel({
      receiveId,
      senderId,
      message,
      image: imageURL,
    });
    await newMessage.save();
    // real time chat
    const receiverSocketId = await getReceiverSocketId(receiveId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res
      .status(200)
      .json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const MyId = req.user._id;
    const messages = await new MessageModel({
      $or: [
        {
          senderId: MyId,
          receiveId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiveId: MyId,
        },
      ],
    });
    console.log(messages);

    return res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while getting messages" });
  }
};
