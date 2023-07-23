const Singer = require("../../../models/Singer");
const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");

module.exports = async (req, res) => {
  try {
    const perPage = 5;
    const page = parseInt(req.params.page) || 1;

    if (page < 1) {
      const allSingers = await Singer.find({});
      return res.json(responseSuccessDetails({ singers: allSingers }));
    }

    const totalSingersCount = await Singer.countDocuments({});
    const singers = await Singer.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.json(
      responseSuccessDetails({
        singers: singers,
        current: page,
        totalPages: Math.ceil(totalSingersCount / perPage),
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
