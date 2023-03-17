const Album = require("../../../models/Album");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  albumType = req.params.type;

  if (page < 1) {
    Album.find({}).then((album) => {
      res.send({ album });
    });
  } else {
    Album.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, album) => {
        Album.countDocuments((err, count) => {
          if (err) return next(err);
          res.send({
            album,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  }
};
