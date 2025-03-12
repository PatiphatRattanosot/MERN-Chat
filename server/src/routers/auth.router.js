const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateProfile,
} = require("../controlles/auth.controller");

router.post("/sign-up", signup);
router.post("/sign-in", login);
router.post("/logout", logout);
router.put("/update-profile/:id", updateProfile);

module.exports = router;
