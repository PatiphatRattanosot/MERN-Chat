const mongoose = require("mongoose");
const { type } = require("os");
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sendId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiveId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = model("Message", MessageSchema);

module.exports = Message;
