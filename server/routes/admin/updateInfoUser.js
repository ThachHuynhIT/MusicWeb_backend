const User = require("../../models/User");
const Resize = require("../../middlewares/Resize");
const path = require("path");
const { mongooseToObject } = require("../../util/mongoose");
require("dotenv").config();

module.exports = async function (req, res, next) {
  const imagePath = path.join("test/public/img");
  const fileUpload = new Resize(imagePath);
  const userId = req.params.id;

  const { email, name, gender, dateOfBirth, nation } = req.body;

  if (req.file) {
    const filename = await fileUpload.save(req.file.buffer);
    // const img = path.join(process.env.LOCAL_STATIC_STORE + filename);
    User.updateOne(
      { _id: userId },
      { email, name, gender, dateOfBirth, nation, img: filename }
    )
      .then((user) => {
        res.redirect("/admin/user/list");
      })
      .catch(next);
  } else {
    User.findByIdAndUpdate(
      { _id: userId },
      { email, name, gender, dateOfBirth, nation }
    )
      .then((user) => {
        res.redirect("/admin/user/list");
      })
      .catch(next);
  }
};
