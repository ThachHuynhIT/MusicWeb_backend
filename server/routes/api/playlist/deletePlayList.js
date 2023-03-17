const Playlist = require("../../../models/PlayList");

module.exports = (req, res, next) => {

  Playlist.deleteOne({ _id: req.params.playlistId })
    .then(res.status(200).send("Thành công"))
    .catch(res.status(400).send("Err"));

};
