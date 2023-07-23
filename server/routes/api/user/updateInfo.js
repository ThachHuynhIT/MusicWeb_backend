const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const Resize = require("../../../middlewares/Resize");
const path = require("path");
const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();

module.exports = async function (req, res) {
  try {
    const imagePath = path.join("test/public/img");
    const fileUpload = new Resize(imagePath);
    const token = req.params.token;

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = verified._id;

    const { email, name, gender, nation, dateOfBirth } = req.body;

    if (req.file && isValidObjectId(userId)) {
      const filename = await fileUpload.save(req.file.buffer);
      await User.updateOne(
        { _id: userId },
        { email, name, gender, dateOfBirth, nation, img: filename }
      );
    } else {
      await User.updateOne(
        { _id: userId },
        { email, name, dateOfBirth, gender, nation }
      );
    }

    return res.json(responseSuccessDetails("Update success"));
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
