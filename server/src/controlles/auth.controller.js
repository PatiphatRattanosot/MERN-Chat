const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../lid/utils");
const cloudinary = require("../lid/cloudinary");

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while registering" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error while login" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error while logout" });
  }
};

exports.updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  //   const userId = req.user._id;
  const userId = req.params.id;

  try {
    if (!profilePic) {
      res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    if (!uploadResponse) {
      res
        .status(500)
        .json({ message: "Error while uploading profile picture" });
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (!updateUser) {
      res.status(500).json({ message: "Error updating profile picture" });
    }
    res
      .status(200)
      .json({ message: "Profile updated successfully" }, updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while updating profile" });
  }
};
