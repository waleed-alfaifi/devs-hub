const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Topic = require("../models/Topic");

router.get("/", async function (req, res, next) {
  try {
    const topics = await Topic.find({}, "-_id name imgUrl path");
    const { isAuthenticated, user } = req;
    const context = {
      title: "Home",
      topics,
      isAuthenticated,
      user,
    };

    res.render("index", context);
  } catch (error) {
    next(createError(500));
  }
});

module.exports = router;
