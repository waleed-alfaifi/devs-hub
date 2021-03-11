const express = require("express");
const router = express.Router();
const controller = require("../controllers/chatController");

router.get("/", controller.index);
router.get("/:topicId", controller.getChat);

module.exports = router;
