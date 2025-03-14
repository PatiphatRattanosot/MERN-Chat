const express = require("express");
const router = express.Router();
const {
  getUserForSidebar,
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");
const { checkFriendShip } = require("../middlewares/friend.middleware");

router.get("/users", protectedRoute, getUserForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, checkFriendShip, sendMessage);

module.exports = router;
