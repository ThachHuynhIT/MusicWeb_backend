const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.params.token;
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = verified._id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const reNewPassword = req.body.reNewPassword;


  if (newPassword === reNewPassword) {

    User.findById({ _id: userId }).then((user) => {
      bcrypt.compare(oldPassword, user.password)
      .then((result) => {
        if (result) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, function (err, hash) {
              User.updateOne(
                { _id: userId },
                { $set: { password: hash } }
              ).then(next);
            });
          });
        }
        res.send({result});
      });
    });
  } else {
    res.json({
      message: { msgBody: "Mật khẩu mới không trùng khớp", msgError: true },
    });
  }
};
