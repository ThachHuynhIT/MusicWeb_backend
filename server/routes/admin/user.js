const express = require("express");
const verifyToken = require("../.././middlewares/verifyToken");
const updateInfo = require("./updateInfoUser")
const upload = require("../.././middlewares/uploadMiddleware");


const router = express.Router();

const userController = require("../../controllers/UserController");

router.get("/", (req, res) => {
    res.render("partials/search");
});
router.get("/list", verifyToken, userController.home);
router.get("/signup", verifyToken, userController.signup);
router.post("/signupStore", verifyToken, userController.signupStore);
router.get("/bin", verifyToken, userController.bin);
router.get("/login", userController.login);
router.post("/author", userController.author);
router.get("/logout", userController.logout);
router.get("/edit/:id", userController.edit);
router.put("/update-user/:id", upload.single("image"), updateInfo);

module.exports = router;
