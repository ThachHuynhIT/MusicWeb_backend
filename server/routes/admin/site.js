const express = require("express");
const router = express.Router();

const sitesController = require("../../controllers/SitesController");

router.get("/admin", sitesController.admin);
router.get("/", sitesController.index);

module.exports = router;
