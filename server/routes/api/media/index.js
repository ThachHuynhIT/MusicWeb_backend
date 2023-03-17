const express = require("express");
const getSongLegion = require("./getSongLegion");

const getSongType = require("./getSongType");
const getSingerSong = require("./getSingerSong");
const getAlbumSong = require("./getAlbumSong");
const postLastAlbum = require("./postLastAlbum");
const searchName = require("./searchName");
const getLastMusic = require("./getLastMusic");
const getAlbum = require("./getAlbum");
const getAlbumType = require("./getAlbumType");
const getSinger = require("./getSinger");

const router = express.Router();

// singer
router.get("/get-singer/:page", getSinger);
router.get("/singer-song/:singer/:page", getSingerSong);
// album
router.get("/song-album/:name/:page", getAlbumSong);
router.get("/get-album/:type/:page", getAlbumType);
router.get("/get-album/:page", getAlbum);
// last music
router.get("/get-last-music/:userId", getLastMusic);
router.put("/post-last-album/:userId", postLastAlbum);
// search
router.get("/searchSong", searchName);
// site
router.get("/song-type/:type/:page", getSongType);
router.get("/song-legion/:legion/:page", getSongLegion);

module.exports = router;
