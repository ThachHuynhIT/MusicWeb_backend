const Song = require("../../../models/Song");
const {
  responseError,
  responseSuccessDetails,
} = require("../../../util/response");

module.exports = async (req, res, next) => {
  try {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;

    if (page < 1) {
      const songs = await Song.find({ legion: req.params.legion });
      return res.json(responseSuccessDetails({ songs: songs }));
    }

    const totalSongsCount = await Song.countDocuments({
      legion: req.params.legion,
    });
    const songs = await Song.find({ legion: req.params.legion })
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.json(
      responseSuccessDetails({
        song: songs,
        current: page,
        totalPages: Math.ceil(totalSongsCount / perPage),
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
