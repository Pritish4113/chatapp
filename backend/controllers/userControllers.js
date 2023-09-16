const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, password, email, pic } = req.body;

  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//  /api/user?search=pritish
// const allUsers = asyncHandler(async (req, res) => {
//   const searchit =  toString(req.query.search);
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: searchit, $options: "i" } },
//           { email: { $regex: searchit, $options: "i" } }
//         ],
//       }
//     : {};

//     console.log(keyword);

//     const users = await User.find(keyword).find({_id : {$ne : req.user._id}});
//     res.send(users);
// });

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
