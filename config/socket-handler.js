const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");
const Topic = require("../models/Topic");
const { formatMessage } = require("./utils");

const rooms = []; // For convenience and simplicity, right now I'm keeping online users sessions in memory

const joinUser = (user, room) => {
  const found = rooms.find((el) => el.room === room);

  if (found) {
    found.users.push(user);
  } else {
    rooms.push({
      room,
      users: [user],
    });
  }

  console.log("rooms", rooms);
};

const userLeave = (user, room) => {
  const roomIndex = rooms.findIndex((el) => el.room === room);

  if (roomIndex > -1) {
    const userIndex = rooms[roomIndex].users.findIndex(
      (persistedUser) => persistedUser === user,
    );

    if (userIndex > -1) {
      rooms[roomIndex].users.splice(userIndex, 1);
    }
  }

  console.log("rooms", rooms);
};

const isUserOnline = (user, room) => {
  let isOnline = false;
  const roomIndex = rooms.findIndex((el) => el.room === room);

  if (roomIndex > -1) {
    const userSessions = rooms[roomIndex].users.filter(
      (persistedUser) => persistedUser === user,
    );

    if (userSessions?.length >= 2) {
      // User has more than one session
      isOnline = true;
    }
  }

  return isOnline;
};

const getOnlineUsers = async (room) => {
  let onlineUsers = [];
  const persistedRoom = rooms.find((el) => el.room === room);

  if (persistedRoom) {
    onlineUsers = [...new Set(persistedRoom.users)]; // Remove duplicates

    // WARNING: Waiting for all promises to resolve means they are all being done in parallel.
    // This is probably consume too much memory when there're a lot of online users.
    // Description: Modify online users array to contain actual information about users
    onlineUsers = await Promise.all(
      onlineUsers.map(async (onlineUser) => {
        const userInfo = await User.findOne({ username: onlineUser });
        const { displayName, username, profileUrl, profileImg } = userInfo;

        return {
          name: displayName,
          username,
          profileUrl,
          profileImg,
        };
      }),
    );
  }

  return onlineUsers;
};

const retrieveMessages = async (topic) => {
  try {
    const messages = await Message.find({ topic }).populate(
      "sender",
      "displayName",
    );

    const formattedMessages = messages.map((message) => {
      const {
        sender: { displayName },
        text,
        date,
      } = message;

      return {
        user: displayName,
        message: text,
        date,
      };
    });

    return formattedMessages;
  } catch (error) {
    console.error(error);
  }
};

module.exports = function (io) {
  io.use(auth.socket);

  io.on("connection", (socket) => {
    const {
      user: { id: userId, displayName, username },
    } = socket.request;

    socket.on("join_topic", async ({ topicId }) => {
      const topic = await Topic.findById(topicId); // Making sure the ID actually exists
      const { id, name: room } = topic;

      // Join user to room
      joinUser(username, room);
      socket.join(room);

      // Notify all online room users
      const onlineUsers = await getOnlineUsers(room);
      io.to(room).emit("online_users", onlineUsers);

      const topicMessages = await retrieveMessages(id);
      socket.emit("initial_messages", topicMessages);

      if (!isUserOnline(username, room)) {
        socket.emit(
          "welcome_msg",
          formatMessage(
            "ChatBot",
            `Hello ${displayName}, Welcome to ${room} room. Please have a meaningful discussion!`,
          ),
        );
      }

      socket.on("send_message", async ({ message }) => {
        const formattedMessage = formatMessage(displayName, message);

        io.to(room).emit("receive_message", formattedMessage);

        // Persist sent message
        await Message.create({
          sender: userId,
          topic: id,
          text: message,
          date: formattedMessage.date,
        });
      });

      // Disconnect from current session (i.e. browser tab)
      socket.on("disconnect", async () => {
        userLeave(username, room);

        const onlineUsers = await getOnlineUsers(room);
        io.to(room).emit("online_users", onlineUsers);
      });
    });
  });
};
