const express = require("express");
const router = express.Router();
const {
  addFriend,
  acceptFriendRequest,
} = require("../controllers/friend.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

router.post("/add", protectedRoute, addFriend);
router.post("/accept", protectedRoute, acceptFriendRequest);

module.exports = router;
