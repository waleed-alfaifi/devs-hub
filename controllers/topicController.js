const createError = require("http-errors");
const Topic = require("../models/Topic");

exports.createTopic = async (req, res, next) => {
  const {
    user: { id: userId },
  } = req;
  const { topicName, imgUrl } = req.body || {};

  if (!topicName || !imgUrl) {
    return next(createError(400, "Please submit all required fields."));
  }

  try {
    const isAllowed = 5 - (await Topic.countDocuments({ owner: userId })) > 0;

    if (isAllowed) {
      await Topic.create({
        name: topicName,
        imgUrl,
        owner: userId,
      });

      return res.redirect("/");
    } else {
      return next(
        createError(403, "You are not allowed to create more than 5 topics."),
      );
    }
  } catch (error) {
    next(error);
  }
};
