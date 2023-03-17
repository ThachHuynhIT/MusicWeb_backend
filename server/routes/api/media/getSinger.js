const Singer = require("../../../models/Singer");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  singerType = req.params.type;

  if (page < 1) {
    Singer.find({}).then((singer) => {
      res.send({ singer });
    });
  } else {
    Singer.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, singer) => {
        singer.countDocuments((err, count) => {
          if (err) return next(err);
          res.send({
            singer,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  }
};
