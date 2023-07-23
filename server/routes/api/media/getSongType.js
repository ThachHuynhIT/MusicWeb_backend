const Song = require("../../../models/Song");
const { responseError } = require("../../../util/response");

module.exports = async (req, res, next) => {
  try {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;

    if (page < 1) {
      const songs = await Song.find({ type: req.params.type });
      return res.json(responseSuccessDetails({ songs: songs }));
    }

    const totalSongsCount = await Song.countDocuments({
      type: req.params.type,
    });
    const songs = await Song.find({ type: req.params.type })
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
