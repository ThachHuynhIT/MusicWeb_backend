const express = require("express");
const router = express.Router();

const songController = require("../../controllers/SongController");

router.get("/edit/:id", songController.edit);
router.post("/store", songController.store);
router.get("/bin", songController.songBin);
router.get("/create", songController.create);
router.post('/handle-form-action', songController.handleFormAction)
router.put("/:id", songController.update);
router.get("/:slug", songController.show);
router.patch("/restore/:id", songController.restore);
router.delete("/:id", songController.destroy);
router.delete("/force/:id", songController.forceDestroy);
router.get("/", songController.index);

module.exports = router;