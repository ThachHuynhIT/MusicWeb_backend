const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");

const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();

module.exports = async function (req, res, next) {
  try {
    const token = req.params.token;
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = verified._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const reNewPassword = req.body.reNewPassword;

    if (!isValidObjectId(userId)) {
      return res.json(responseError({ message: "Invalid user ID" }));
    }

    if (newPassword === reNewPassword) {
      const user = await User.findById(userId);
      if (!user) {
        return res.json(responseError("User not found"));
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordValid) {
        return res.json(responseError({ message: "Invalid old password" }));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne(
        { _id: userId },
        { $set: { password: hashedNewPassword } }
      );

      return res.json(
        responseSuccessDetails({
          message: "Password updated successfully",
        })
      );
    } else {
      return res.json(responseError("New passwords do not match"));
    }
  } catch (err) {
    console.error("Error:", err);

    return res.json(responseError("Internal server error", 500));
  }
};
