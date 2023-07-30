const User = require("../model/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required. " });
  } // verify username and password in request
  const foundUser = await User.findOne({ username: username }).exec(); // search for user in DB
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, foundUser.password); // verify passsword
  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    ); //create Access Token
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1y" }
    ); //create Refresh Token
    //add Refresh Token to user
    const result = await User.findByIdAndUpdate(foundUser._id, {
      refreshToken: refreshToken,
    }); //add Refresh Token to user and save refresh token into DB
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //secure: true,  (REMEMBER TO UNCOMMENT FOR FINAL BUILD)
      maxAge: 24 * 60 * 60 * 1000,
    }); //create cookie for refresh token
    res.json({ accessToken }); //spit out access token for local storage
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
