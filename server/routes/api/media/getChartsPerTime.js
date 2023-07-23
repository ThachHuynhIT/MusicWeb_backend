const {
  responseSuccessDetails,
  responseError,
} = require("../../../util/response");
const Song = require("../../../models/Song");

module.exports = async (req, res) => {
  try {
    const type = req.params.time;

    let query = "views" + type.charAt(0).toUpperCase() + type.slice(1);

    if (type != "day" && type != "month") {
      return res.json(responseError("Type is not correct format " + type));
    } else {
      const songs = await Song.find({})
        .sort({ [query]: -1 })
        .limit(10);
      return res.json(responseSuccessDetails(songs));
    }
  } catch (error) {
    console.error("Error:", error);

    return res.json(responseError("Internal server error", 500));
  }
};
