const User = require("../../../models/User");
const Song = require("../../../models/Song");

module.exports = (req, res, next) => {
  const id = req.params.userId;
  const lastSong = req.body.songId;

  const lastPlaylist = req.body.playlistId;
  const lastSinger = req.body.singerName;
  const lastAlbum = req.body.albumName;

  if (id) {
    if (lastAlbum) {
      const typeList = "Album";
      User.updateOne(
        { _id: id },
        { lastList: lastAlbum, typeList: typeList, lastSong: lastSong }
      )

        .then(next)
        .catch(next);
    } else if (lastPlaylist) {
      const typeList = "Playlist";
      User.updateOne(
        { _id: id },
        { lastList: lastPlaylist, typeList: typeList, lastSong: lastSong }
      ).then(next);
    } else if (lastSinger) {
      const typeList = "Singer";
      User.updateOne(
        { _id: id },
        { lastList: lastSinger, typeList: typeList, lastSong: lastSong }
      ).then(next);
    } else {
      User.updateOne({ _id: id }, { lastSong: lastSong }).then(next);
    }

    Song.findById({ _id: lastSong })
      .then((song) => {
        if (song.views) {
          song.views = song.views + 1;
          song.save();
        } else {
          song.views = 1;
          song.save();
        }
        res.status(200).json("Thành công");
      })
      .catch(next);
  } else {
    res.status(400).json("Lỗi");
  }
};
