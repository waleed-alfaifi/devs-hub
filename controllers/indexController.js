const Topic = require("../models/Topic");

exports.index = async (req, res, next) => {
  try {
    const { isAuthenticated, user } = req;
    const topics = await Topic.find({}, "-_id name imgUrl path");
    let remainingTopics = 0;

    if (user) {
      remainingTopics = 5 - (await Topic.countDocuments({ owner: user._id })); // max. is 5
    }

    const context = {
      title: "Home",
      topics,
      isAuthenticated,
      user,
      remainingTopics,
      isAllowedToAddTopics: remainingTopics > 0,
    };

    res.render("index", context);
  } catch (error) {
    next(error);
  }
};
