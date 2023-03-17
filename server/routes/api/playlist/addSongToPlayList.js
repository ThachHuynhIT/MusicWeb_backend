const { connections } = require("mongoose");
const Playlist = require("../../../models/PlayList");

module.exports = (req, res, next) => {
  const songId = req.params.songId;
  const playlistId = req.params.playlistId;

  // Playlist.findById({ _id: playlistId }).then((playlist) => {
  //   arr = playlist.songList;
  //   console.log(arr);
  //   Playlist.find({ songList: songId }).then((list) => {
  //     const le = list.length
  //     if (le==0) {
  //       res.send(le);
  //     } else {
  //     res.send({le, list});
  //     }
  //   });
  // })
  // .catch(res.status(400).send("Err"));

  
  Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $push: {
        songList: {
          $each: [songId],
          $position: -1,
        },
      },
    }
  )
    .then(res.status(200).send("Thành công"))
    .catch(next);
};
