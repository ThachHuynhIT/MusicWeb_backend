const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const loginValidator = require("../../../validations/login");
const signupValidator = require("../../../validations/signup");
const upload = require("../../../middlewares/uploadMiddleware");
const updateInfo = require("./updateInfo");
const changePassword = require("./changePassword");
const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { isValid, errors } = loginValidator(req.body);

    if (!isValid) {
      return res.json(responseError(errors, 400));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.json(responseError(errors, 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json(responseError("Mật khẩu không đúng", 401));
    }

    const id = user._id;

    const token = jwt.sign({ _id: id }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    // .cookie("access_token", token, { httpOnly: true, sameSite: true })
    // .header({
    //   username: user.username,
    // })
    return res.json(
      responseSuccessDetails({
        userId: id,
        isAuthen: true,
        access_token: token,
      })
    );
  } catch (err) {
    console.error("Error:", err);

    return res.json(responseError("Internal server error", 500));
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { isValid, errors } = signupValidator(req.body);

    if (!isValid) {
      return res.json(responseError(errors, 400));
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json(responseError("Username is already taken", 422));
    }

    const user = new User(req.body);
    await user.save();
    return res.json(responseSuccessDetails("Tạo tài khoản thành công"));
  } catch (err) {
    console.error("Error:", err);

    return res.json(responseError("Internal server error", 500));
  }
});

router.get("/logout", (req, res) => {
  return res
    .clearCookie("access_token")
    .json({ user: { username: "" }, isAuthenticated: false });
});

router.get("/authen/:token", (req, res) => {
  try {
    const token = req.params.token;

    if (!token) return res.json(responseError("Token not found", 401));

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = verified._id;
    User.findById({ _id: userId }, { password: 0 }).then((user) => {
      if (!user) {
        return res.json(responseError("User not found", 401));
      }
      return res.json(responseSuccessDetails(user));
    });
  } catch (err) {
    console.error("Error:", err);

    return res.json(responseError("Internal server error", 500));
  }
});

router.put("/update-user/:token", upload.single("image"), updateInfo);
router.put("/change-password/:token", changePassword);

module.exports = router;
