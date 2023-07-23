const Song = require("../../../models/Song");
const {
  responseError,
  responseSuccessDetails,
} = require("../../../util/response");

module.exports = async (req, res, next) => {
  try {
    const perPage = 5;
    const page = parseInt(req.params.page) || 1;
    const singer = req.params.singer;

    if (page < 1) {
      const songs = await Song.find({ singer: singer });
      return res.json(responseSuccessDetails({ songs: songs }));
    }

    const totalSongsCount = await Song.countDocuments({ singer: singer });
    const songs = await Song.find({ singer: singer })
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.json(
      responseSuccessDetails({
        songs: songs,
        current: page,
        totalPages: Math.ceil(totalSongsCount / perPage),
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
