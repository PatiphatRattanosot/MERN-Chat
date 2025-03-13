const express = require("express");
const router = express.Router();
const { getUserForSidebar } = require("../controlles/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

router.get("/users", protectedRoute, getUserForSidebar);

module.exports = router;
