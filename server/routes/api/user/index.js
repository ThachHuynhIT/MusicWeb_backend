const express = require("express");
const User = require("../../../models/User");
const loginValidator = require("../../../validations/login");
const signupValidator = require("../../../validations/signup");
const upload = require("../../../middlewares/uploadMiddleware");
const jwt = require("jsonwebtoken");
const co = require("co");
const updateInfo = require("./updateInfo");
const changePassword = require("./changePassword");

const router = express.Router();

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  const { isValid, errors } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ error: true, errors });
  }

  co(function* () {
    const user = yield User.findOne({ username });
    if (!user) {
      res.status(401).json({
        message: { msgBody: "Tên đăng nhập không đúng", msgError: true },
      });
    }

    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        message: { msgBody: "Mật khẩu không đúng", msgError: true },
      });
    }

    return user;
  })
    .then((user) => {
      const id = user._id;

      const token = jwt.sign({ _id: id }, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      res
        .cookie("access_token", token, { httpOnly: true, sameSite: true })
        .header({
          username: user.username,
        })
        .send({ userId: id, isAuthen: true, access_token: token });
    })
    .catch((err) => next(err));
});

router.post("/signup", (req, res, next) => {
  const { username } = req.body;
  const { isValid, errors } = signupValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ error: true, errors });
  }

  co(function* () {
    const existingUser = yield User.findOne({ username });

    if (existingUser) return res.status(422).send("Username is exist");

    const user = new User(req.body);
    return user.save();
  })
    .then(() =>
      res.status(200).json({
        message: {
          msgBody: "Tao tai khoan thanh cong",
          msgError: false,
        },
      })
    )
    .catch((err) => next(err));
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
      res.status(200).send({
        isAuthenticated: true,
        user: user,
      });
    });
  } catch (err) {
    return res.status(401).json({ isAuthenticated: false });
  }
});

router.put("/update-user/:token", upload.single("image"), updateInfo);
router.put("/change-password/:token", changePassword);

module.exports = router;
