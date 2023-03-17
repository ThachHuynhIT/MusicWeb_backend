const Song = require("../../../models/Song");

module.exports = (req, res, next) => {
  let perPage = 5;
  let page = req.params.page || 1;
  const singer = req.params.singer;

  if (page < 1) {
    Song.find({ singer: singer })
      .then((song) => {
        res.send(song);
      })
      .catch(next);
  } else {
    Song.find({ singer: singer })
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
