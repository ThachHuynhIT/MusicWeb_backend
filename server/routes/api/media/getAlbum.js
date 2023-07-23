const Album = require("../../../models/Album");
const {
  responseError,
  responseSuccessDetails,
} = require("../../../util/response");

module.exports = async (req, res, next) => {
  try {
    const perPage = 5;
    const page = parseInt(req.params.page) || 1;

    if (page < 1) {
      const albums = await Album.find({});
      return res.json(responseSuccessDetails({ albums: albums }));
    }

    const totalAlbumsCount = await Album.countDocuments({});
    const albums = await Album.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.json(
      responseSuccessDetails({
        albums,
        current: page,
        totalPages: Math.ceil(totalAlbumsCount / perPage),
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
