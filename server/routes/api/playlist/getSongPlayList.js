const Playlist = require("../../../models/PlayList");
const Song = require("../../../models/Song");

module.exports = (req, res, next) => {
  Playlist.find(
    {
      _id: req.params.playlistId,
    },
    { songList: 1, _id: 0 }
  )
    .then((songList) => {
      var arr = songList[0].songList;
      const t = { _id: { $in: arr } };
      Song.find(t).then((song) => res.send(song));
    })
    .catch(next);

};
