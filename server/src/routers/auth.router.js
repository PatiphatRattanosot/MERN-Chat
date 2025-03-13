const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controlles/auth.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

router.post("/sign-up", signup);
router.post("/sign-in", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/", protectedRoute, checkAuth);

module.exports = router;
