const User = require("../models/User");
const { mongooseToObject } = require("../util/mongoose");
const { multipleMongooseToObject } = require("../util/mongoose");
const loginValidator = require("../validations/login");
const signupValidator = require("../validations/signup");
const jwt = require("jsonwebtoken");
const co = require("co");
require("dotenv").config();

class UsersController {
  //[GET] route /user/list
  home(req, res, next) {
    Promise.all([User.find({}), User.countDocumentsDeleted()])
      .then(([user, deletedCount]) => {
        res.render("users/home", {
          deletedCount,
          user: multipleMongooseToObject(user),
        });
      })
      .catch(next);
  }

  //[GET] route /user/login
  login(req, res, next) {
    res.render("users/login");
  }

  //[POST] route /user/author
  author(req, res, next) {
    const { username, password } = req.body;
    const { isValid, errors } = loginValidator(req.body);

    if (!isValid) {
      return res
        .status(400)
        .render("users/login", { error: "Thiếu tên đăng nhập hoặc mật khẩu!" });
    }

    co(function* () {
      const user = yield User.findOne({ username });
      if (!user) {
        throw res.render("users/login", {
          error: "Tên đăng nhập hoặc mật khẩu sai!",
        });
      }

      const isMatch = yield user.comparePassword(password);
      if (!isMatch) {
        throw res.render("users/login", {
          error: "Tên đăng nhập hoặc mật khẩu sai!",
        });
      }

      return user;
    })
      .then((user) => {
        const role = user.role;
        if (role === "admin") {
          const id = user._id;

          const token = jwt.sign({ _id: id }, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
          });
          res
            .cookie("access_token", token, { httpOnly: true, sameSite: true })
            .cookie("username", username, { httpOnly: true, sameSite: true })
            .header({
              username: user.username,
            })
            .redirect("/admin")
            .send({
              user: mongooseToObject(user),
            });
        } else {
          res.render("users/login", { error: "Bạn không phải admin" });
        }
      })
      .catch((err) => next(err));
  }

  //[GET] route /user/logout
  logout(req, res, next) {
    res
      .clearCookie("access_token")
      .clearCookie("username")
      .render("users/login");
  }

  //[GET] route /user/signPage
  signup(req, res, next) {
    res.render("./users/signup");
  }

  //[POST] route /user/signupStore
  signupStore(req, res, next) {
    const { username, password } = req.body;
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
      .then(() => res.status(200).redirect("back"))
      .catch((err) => next(err));
  }

  //[GET] route /user/bin
  bin(req, res, next) {
    User.findDeleted({})
      .then((user) => {
        res.render("./users/bin", {
          user: multipleMongooseToObject(user),
        });
      })
      .catch(next);
  }

  edit(req, res, next) {
    User.findById({ _id: req.params.id }).then((user) => {
      res.render("users/edit", {
        user: mongooseToObject(user),
      });
    });
  }
}

module.exports = new UsersController();
