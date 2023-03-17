const Playlist = require("../../../models/PlayList");
const path = require("path");

const Resize = require("../../../middlewares/Resize");

module.exports = async function (req, res, next) {
  const imagePath = path.join("test/public/img");
  const fileUpload = new Resize(imagePath);
  const name = req.body.name;

  if (req.file) {
    const filename = await fileUpload.save(req.file.buffer);
    Playlist.updateOne(
      { _id: req.params.playlistId },
      { img: filename, name: name }
    )
      .then(res.status(200).json("Thành công"))
      .catch(next);
  } else {
    Playlist.updateOne({ _id: req.params.playlistId }, { name: name })
      .then(res.status(200).json("Thành công"))
      .catch(next);
  }
    

};
