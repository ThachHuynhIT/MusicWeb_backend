const User = require("../../../models/User");
const Song = require("../../../models/Song");
const Album = require("../../../models/Album");
const Playlist = require("../../../models/PlayList");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const userId = req.params.userId;

  if (userId) {
    User.findById({ _id: userId }).then((user) => {
      const songId = user.lastSong;
      const lastList = user.lastList;

      Song.find({})
        .then((song) => {
          var lastSong = song.filter((song) => {
            return song.id.indexOf(songId) !== -1;
          });

          switch (user.typeList) {
            case "Album":
              Album.findById({ _id: lastList }).then((album) => {
                var albumName = album.name;
                let songList = song.filter((song) => {
                  return song.album.indexOf(albumName) !== -1;
                });
                res.send({
                  song: lastSong,
                  songList: songList,
                });
              });
              break;
            case "Singer":
              var songList = song.filter((song) => {
                return song.singer.indexOf(lastList) !== -1;
              });
              res.send({
                song: lastSong,
                songList: songList,
              });
              break;
            case "Playlist":
              Playlist.findById({ _id: lastList }).then((playlist) => {
                songList = playlist;
                res.send({
                  song: lastSong,
                  songList: songList,
                });
              });
              break;
            default:
              res.send("Lỗi");
          }
        })
        .catch(next);
        
    });
  } else {
    return res.status(400).send(userId);
  }
};
