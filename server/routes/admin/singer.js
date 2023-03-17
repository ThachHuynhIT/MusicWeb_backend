const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploadMiddleware")

const singerController = require("../../controllers/SingerController");

router.put("/upload-img/:id",upload.single("image") ,singerController.uploadImage)
router.get("/edit/:id", singerController.edit);
router.put("/:id", singerController.update);
router.post("/store", singerController.store);
router.get("/bin", singerController.singerBin);
router.get("/create", singerController.create);
router.post('/handle-form-action', singerController.handleFormAction)
router.get("/:slug", singerController.show);
router.patch("/restore/:id", singerController.restore);
router.delete("/:id", singerController.destroy);
router.delete("/force/:id", singerController.forceDestroy);
router.get("/", singerController.index);

module.exports = router;