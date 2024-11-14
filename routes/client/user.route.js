const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/not-friend", controller.notFriend);
router.get("/request", controller.request);
router.get("/accept", controller.accept);
router.get("/friends", controller.friends);
module.exports = router;