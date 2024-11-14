const express = require("express");
const router = express.Router();
const multer  = require('multer');
const upload = multer();
// const uploadCloud = require("../../middlewares/admin/uploadcloud.middleware");
const controller = require("../../controllers/client/chat.controller");

router.get("/", controller.index);

module.exports = router;