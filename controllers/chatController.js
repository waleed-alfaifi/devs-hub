const createError = require("http-errors");
const Topic = require("../models/Topic");
const Message = require("../models/Message");

exports.index = function (req, res, next) {
  // TODO: Make the user redirect to a chosen topic
  res.send("hello");
};

exports.getChat = async function (req, res, next) {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOne({ _id: topicId });
    const { name, imgUrl } = topic;
    const initialMessages = await Message.find(
      { topic: topicId },
      "-_id text date sender",
    ).populate("sender", "-_id displayName");

    res.render("chat", {
      title: name,
      topicName: name,
      topicImage: imgUrl,
      initialMessages,
    });
  } catch (error) {
    console.error(error);
    next(createError(error));
  }
};
