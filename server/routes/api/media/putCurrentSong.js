const User = require("../../../models/User");
const Song = require("../../../models/Song");
const { isValidObjectId } = require("mongoose");
const {
  responseError,
  responseSuccessDetails,
} = require("../../../util/response");

function getISOWeekNumber(date) {
  const newDate = new Date(date);
  const firstDayOfYear = new Date(newDate.getFullYear(), 0, 1);
  let firstMondayOfYear = firstDayOfYear;
  while (firstMondayOfYear.getDay() !== 1) {
    firstMondayOfYear.setDate(firstMondayOfYear.getDate() + 1);
  }
  const daysSinceFirstMonday = Math.floor(
    (newDate - firstMondayOfYear) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((daysSinceFirstMonday + 1) / 7);
  return weekNumber;
}

module.exports = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const lastSong = req.body.songId;
    const lastPlaylist = req.body.playlistId;
    const lastSinger = req.body.singerName;
    const lastAlbum = req.body.albumName;

    const today = new Date();
    let hh = today.getHours();

    if (!isValidObjectId(id) || !isValidObjectId(lastSong)) {
      return res.status(400).json(responseError("Invalid user ID or song ID."));
    }

    let updateData = { lastSong };

    if (lastAlbum) {
      updateData.lastList = lastAlbum;
      updateData.typeList = "Album";
    } else if (lastPlaylist) {
      updateData.lastList = lastPlaylist;
      updateData.typeList = "Playlist";
    } else if (lastSinger) {
      updateData.lastList = lastSinger;
      updateData.typeList = "Singer";
    }

    const updateUserPromise = User.updateOne({ _id: id }, updateData);

    const song = await Song.findById(lastSong);

    if (!song) {
      return res.status(400).json(responseError("Song not found."));
    }

    const lastViewTime = song.updatedAt;
    const timeDifference = today - lastViewTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // If the last view was more than 24 hours ago, reset the viewsLast24Hours array
    if (hoursDifference >= 24) {
      song.viewsLast24Hours = Array(24).fill(0);
    }

    // Update last 24h view
    if (song.viewsLast24Hours.length > 0 && song.viewsLast24Hours[hh]) {
      song.viewsLast24Hours[hh] += 1;
    } else {
      song.viewsLast24Hours[hh] = 1;
    }

    // Update view today
    if (song.viewsDay && song.lastViewDate.getDate() === today.getDate()) {
      song.viewsDay += 1;
    } else {
      song.viewsDay = 1;
    }

    // Update view this week
    if (
      song.viewsWeek &&
      getISOWeekNumber(song.lastViewDate) === getISOWeekNumber(today)
    ) {
      song.viewsWeek += 1;
    } else {
      song.viewsWeek = 1;
    }

    // Update view this month
    if (song.viewsMonth && song.lastViewDate.getMonth() === today.getMonth()) {
      song.viewsMonth += 1;
    } else {
      song.viewsMonth = 1;
    }

    // Update total views
    if (song.views) {
      song.views += 1;
      song.lastViewDate = today;
    } else {
      song.views = 1;
    }

    const updateSongPromise = song.save();

    await Promise.all([updateUserPromise, updateSongPromise]);

    return res.status(200).json(responseSuccessDetails(song));
  } catch (error) {
    console.error("Error:", error);
    return res.json(responseError("Internal server error", 500));
  }
};
