const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sendId: {
      type: String,
      required: true,
    },
    receiveId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = model("Message", MessageSchema);

module.exports = Message;
