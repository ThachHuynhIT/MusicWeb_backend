const User = require("../../../models/User");
const Song = require("../../../models/Song");
const Album = require("../../../models/Album");
const Playlist = require("../../../models/PlayList");
const jwt = require("jsonwebtoken");
const {
  responseError,
  responseSuccessDetails,
} = require("../../../util/response");

module.exports = async function (req, res, next) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const songId = user.lastSong;
    const lastList = user.lastList;

    const song = await Song.find({});
    const lastSong = song.find((song) => song.id === songId);

    let songList = [];
    switch (user.typeList) {
      case "Album":
        const album = await Album.findById(lastList);
        if (!album) {
          return res.json(responseError("Album not found"));
        }
        const albumName = album.name;
        songList = song.filter((song) => song.album.includes(albumName));
        break;
      case "Singer":
        songList = song.filter((song) => song.singer.includes(lastList));
        break;
      case "Playlist":
        const playlist = await Playlist.findById(lastList);
        if (!playlist) {
          return res.json(responseError("Playlist not found"));
        }
        songList = playlist.songs;
        break;
      default:
        return res.json(responseError("Invalid list type"));
    }

    return res.json(
      responseSuccessDetails({
        song: lastSong,
        songList: songList,
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
