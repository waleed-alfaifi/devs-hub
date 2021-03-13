const express = require("express");
const router = express.Router();
const controller = require("../controllers/topicController");

router.post("/create", controller.createTopic);

module.exports = router;
