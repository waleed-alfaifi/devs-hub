const createError = require("http-errors");
const Topic = require("../models/Topic");

exports.index = function (req, res, next) {
  // TODO: Make the user redirect to a chosen topic
  res.send("hello");
};

exports.getChat = async function (req, res, next) {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOne({ _id: topicId });
    const { name, imgUrl } = topic;

    res.render("chat", { title: name, topicName: name, topicImage: imgUrl });
  } catch (error) {
    console.error(error);
    next(createError(error));
  }
};
