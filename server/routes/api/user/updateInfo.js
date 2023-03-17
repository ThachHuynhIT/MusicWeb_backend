const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const Resize = require("../../../middlewares/Resize");
const path = require("path");
require("dotenv").config();

module.exports = async function (req, res, next) {
  const imagePath = path.join("test/public/img");
  const fileUpload = new Resize(imagePath);
  const token = req.params.token;
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = verified._id;

  const { email, name, gender, nation, dateOfBirth } = req.body;

  if (req.file) {
    const filename = await fileUpload.save(req.file.buffer);

    User.updateOne(
      { _id: userId },
      { email, name, gender, dateOfBirth, nation, img: filename }
    )
      .then(res.send("Thành công"))
      .catch(next);
  } else {
    User.updateOne(
      { _id: userId },
      { email, name, dateOfBirth, gender, nation }
    )

      .then(res.send("Thành công"))

      .catch(next);
  }
};
