const Song = require("../../../models/Song");
const Singer = require("../../../models/Singer");
const Album = require("../../../models/Album");

module.exports = (req, res, next) => {
  let page = req.query.page || 1;
  var name_search = req.query.name;

  if (page < 1) {
    Promise.all([Album.find({}), Song.find({}), Singer.find({})])
      .then(([album, song, singer]) => {
        var listAlbum = album.filter((album) => {
          return (
            album.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        var listSong = song.filter((song) => {
          return (
            song.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        var listSinger = singer.filter((singer) => {
          return (
            singer.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        res.send({
          song: listSong,
          album: listAlbum,
          singer: listSinger,
        });
      })
      .catch(next);
  } else {
    Promise.all([Album.find({}), Song.find({}), Singer.find({})])
      .then(([album, song, singer]) => {
        var listAlbum = album.filter((album) => {
          return (
            album.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        var listSong = song.filter((song) => {
          return (
            song.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        var listSinger = singer.filter((singer) => {
          return (
            singer.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
          );
        });
        res.send({
          song: listSong.slice(0, 5),
          album: listAlbum.slice(0, 5),
          singer: listSinger.slice(0, 5),
        });
      })
      .catch(next);
  }
};
