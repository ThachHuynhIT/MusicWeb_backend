const Song = require("../../../models/Song");

module.exports = (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  const albumName = req.params.name;

  if (page < 1) {
    Song.find({ album: albumName }).then((song) => {
      res.send({ song });
    });
  } else {
    Song.find({ album: albumName })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, song) => {
        Song.countDocuments((err, count) => {
          if (err) return next(err);
          res.send({
            song,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  }
};
