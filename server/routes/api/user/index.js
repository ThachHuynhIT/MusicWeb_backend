const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const loginValidator = require("../../../validations/login");
const signupValidator = require("../../../validations/signup");
const upload = require("../../../middlewares/uploadMiddleware");
const updateInfo = require("./updateInfo");
const changePassword = require("./changePassword");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const { isValid, errors } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ error: true, errors });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: { msgBody: "Tên đăng nhập không đúng", msgError: true },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: { msgBody: "Mật khẩu không đúng", msgError: true },
      });
    }

    const id = user._id;

    const token = jwt.sign({ _id: id }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    res
      .cookie("access_token", token, { httpOnly: true, sameSite: true })
      .header({
        username: user.username,
      })
      .json({ userId: id, isAuthen: true, access_token: token });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res, next) => {
  const { username } = req.body;
  const { isValid, errors } = signupValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ error: true, errors });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(422).json({ message: "Username is already taken" });
    }

    const user = new User(req.body);
    await user.save();
    return res.status(200).json({
      message: {
        msgBody: "Tạo tài khoản thành công",
        msgError: false,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  res
    .clearCookie("access_token")
    .json({ user: { username: "" }, isAuthenticated: false });
});

router.get("/authen/:token", (req, res) => {
  const token = req.params.token;

  if (!token)
    return res
      .status(401)
      .json({ isAuthenticated: false, error: "Không tìm thấy token" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = verified._id;
    User.findById({ _id: userId }, { password: 0 }).then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ isAuthenticated: false, error: "User not found" });
      }
      res.status(200).json({
        isAuthenticated: true,
        user: user,
      });
    });
  } catch (err) {
    return res
      .status(401)
      .json({ isAuthenticated: false, error: "Invalid token" });
  }
});

router.put("/update-user/:token", upload.single("image"), updateInfo);
router.put("/change-password/:token", changePassword);

module.exports = router;
