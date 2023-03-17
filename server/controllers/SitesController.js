const Album = require("../models/Album");
const User = require("../models/User");
const { multipleMongooseToObject } = require("../util/mongoose");

class SitesController {
  //[GET] route /Music
  index(req, res, next) {
    Album.find({})
      .then((album) => {
        res.render("home", {
          album: multipleMongooseToObject(album),
        });
      })
      .catch(next);
  }

  //[GET] route  (mo rong)
  admin(req, res, next) {
    Promise.all([User.find({}), User.countDocumentsDeleted()])
      .then(([user, deletedCount]) =>
        res.send({
          deletedCount,
          user: user,
        })
      )
      .catch(next);
  }
}

module.exports = new SitesController();
