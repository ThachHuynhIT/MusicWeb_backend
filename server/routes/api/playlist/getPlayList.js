const Playlist = require("../../../models/PlayList");

module.exports = (req, res, next) => {
  Playlist.find({ userId: req.params.userId })
    .then((playlist) => res.send(playlist))
    .catch(next);
};
