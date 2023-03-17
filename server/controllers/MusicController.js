const Song = require("../models/Song");
const { multipleMongooseToObject } = require("../util/mongoose");

class MusicController {
  //[GET] route /Music
  index(req, res, next) {
    Song.find({})
      .then((song) => {
        res.send({
          song: multipleMongooseToObject(song),
        });
      })
      .catch(next);
  }
}

module.exports = new MusicController();
