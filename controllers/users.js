const User = require("../models/user");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const avatarsDir = path.join(__dirname, "..//public/avatars");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const msg = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Click to verify email</a>`,
  };
  sendEmail(msg);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { token: "" });
  if (!user) {
    throw HttpError(401);
    }
    res.status(204).json();
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  if (!subscription) {
    throw HttpError(400, "Empty subscription field");
  }
  if (subscription !== "starter" && subscription !== "pro" && subscription !== "business") {
    throw HttpError(400, "Invalid subscription");
  }

  const result = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  if (!result) {
    throw HttpError(404, `User with id=${_id} not found`);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "File is missing");
  }

  const { path: tempPath, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;
  const newPath = path.join(avatarsDir, fileName);
  await fs.rename(tempPath, newPath);

  const avatar = await Jimp.read(newPath);
  // avatar.contain(250, 250);
  avatar.resize(250, 250);
  avatar.writeAsync(newPath);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const msg = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">Click for email verification</a>`,
  };
  sendEmail(msg);

  res.json({ message: "Verification email sent" });
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};