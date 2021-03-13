const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  githubId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  topics: [
    {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      max: [5, "You are not allowed to create more than 5 topics."],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
