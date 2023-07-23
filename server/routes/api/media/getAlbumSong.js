const Song = require("../../../models/Song");
const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");

module.exports = async (req, res) => {
  try {
    const perPage = 5;
    const page = parseInt(req.params.page) || 1;
    const albumName = req.params.name;

    if (page < 1) {
      const songs = await Song.find({ album: albumName });
      return res.json(responseSuccessDetails({ songs: songs }));
    }

    const totalSongsCount = await Song.countDocuments({ album: albumName });
    const songs = await Song.find({ album: albumName })
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.json(
      responseSuccessDetails({
        songs,
        current: page,
        totalPages: Math.ceil(totalSongsCount / perPage),
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
