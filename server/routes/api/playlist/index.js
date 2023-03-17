const express = require("express");
const upload = require("../../../middlewares/uploadMiddleware");

const getPlayList = require("./getPlayList");
const deletePlayList = require("./deletePlayList");
const createPlayList = require("./createPlayList");

const getSongPlayList = require("./getSongPlayList");
const updatePlaylistImg = require("./updatePlaylistImg");
const addSongToPlayList = require("./addSongToPlayList");
const deleteSongOfPlayList = require("./deleteSongOfPlayList");

const router = express.Router();

router.get("/get-playlist/:userId", getPlayList);
router.post("/create-playlist/:userId", createPlayList);
router.delete("/delete-playlist/:playlistId", deletePlayList);
router.get("/get-song-playlist/:playlistId", getSongPlayList);
router.put(
  "/update-playlist-img/:playlistId",
  upload.single("image"),
  updatePlaylistImg
);
router.put("/add-song-playlist/:playlistId/:songId", addSongToPlayList);
router.put("/delete-song-playlist/:playlistId/:songId", deleteSongOfPlayList);

module.exports = router;
