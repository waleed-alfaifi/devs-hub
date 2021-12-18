const User = require("../models/User");
const Topic = require("../models/Topic");
const { topicsLimit } = require("../config/constants");

exports.index = async (req, res, next) => {
  try {
    const { isAuthenticated, user } = req;
    const topics = await Topic.find({}, "-_id name imgUrl path");
    let remainingTopics = 0;

    if (user) {
      remainingTopics =
        topicsLimit - (await Topic.countDocuments({ owner: user._id }));
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

exports.profile = async (req, res, next) => {
  const { _id: userId } = req.user;
  try {
    const userInfo = await User.findById({ _id: userId });
    const userTopics = await Topic.find({ owner: userId }, "-owner");

    res.render("profile", {
      title: "Profile",
      user: userInfo,
      topics: userTopics,
    });
  } catch (error) {
    next(error);
  }
};
