const express = require("express");
const router = express.Router();

const musicsController = require("../../controllers/MusicController");

// router.get("/:slug", musicsController.show);
router.get("/", musicsController.index);

module.exports = router;
