const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

// @description: Register new user
// @route: POST /api/users
// @access: Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @description: Authenticate user & get token
// @route: POST /api/users/login
// @access: Public
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @description: Get user profile
// @route: GET /api/users/profile
// @access: Public
exports.getUserProfile = asyncHandler(async (req, res) => {
  res.send("User profile placeholder - success");
});
