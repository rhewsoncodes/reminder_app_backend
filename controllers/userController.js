const User = require("../model/User");
const bcrypt = require("bcrypt");

const QRCode = require("qrcodejs");

const handleNewUser = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    confirmEmail,
    pwd,
    confirmPwd,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !confirmEmail ||
    !pwd ||
    !confirmPwd
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (pwd !== confirmPwd) {
    return res
      .status(400)
      .json({ message: "Password and confirm password are not identical." });
  }
  if (email !== confirmEmail) {
    return res
      .status(400)
      .json({ message: "Email and confirm email are not identical." });
  }
  // ^^ Make sure request is valid

  const duplicate = await User.findOne({ username: username }).exec();

  if (duplicate) return res.sendStatus(409); // Conflict if username already there

  const emailDuplicate = await User.findOne({ email: email }).exec();

  if (emailDuplicate) return res.sendStatus(409); // Conflict if email already there

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPwd,
      email: email,
      onVacation: false,
    });
    console.log(result);

    res.status(201).json({ success: `New user ${username} has been created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleVacation = async (req, res) => {
  const user = User.find({ _id: req.user });
  if (user.onVacation) {
    try {
      await User.findByIdAndUpdate(req.user, { onVacation: false });
    } catch (err) {
      console.log(err.message);
    }
  } else {
    try {
      await User.findByIdAndUpdate(req.user, { onVacation: true });
    } catch (err) {
      console.log(err.message);
    }
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = User.find({ _id: req.user });
    return res.status(204).json({
      username: user.username,
      email: user.email,
      onVacation: user.onVacation,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser, toggleVacation, getUserDetails };
