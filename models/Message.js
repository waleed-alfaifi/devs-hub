const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
