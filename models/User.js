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
      max: 5,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
