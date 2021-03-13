const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  onlineUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);
