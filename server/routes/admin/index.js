const express = require("express");
const verifyToken = require("../../middlewares/verifyToken");

const musicRouter = require("./music");
const sitesRouter = require("./site");
const albumRouter = require("./album");
const songRouter = require("./song");
const singerRouter = require("./singer");
const userRouter = require("./user");

const router = express.Router();

router.use("/user",  userRouter);

router.use("/album", verifyToken, albumRouter);

router.use("/song", verifyToken, songRouter);

router.use("/singer", verifyToken, singerRouter);

router.use("/music", verifyToken, musicRouter);

router.use("/", verifyToken, sitesRouter);

module.exports = router;
