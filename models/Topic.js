const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
});

TopicSchema.pre("save", function (next) {
  this.path = `/chat/${this._id}`;
  next();
});

module.exports = mongoose.model("Topic", TopicSchema);
