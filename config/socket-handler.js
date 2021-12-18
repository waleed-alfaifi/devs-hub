const sanitizeHtml = require("sanitize-html");
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");
const Topic = require("../models/Topic");
const { formatMessage, logDev } = require("./utils");

const rooms = {}; // For convenience and simplicity, right now I'm keeping online users sessions in memory

const joinUser = (user, room) => {
  rooms[room] = rooms[room] || [];
  rooms[room].push(user);

  logDev("rooms", rooms);
};

const userLeave = (user, room) => {
  const persistedRoom = rooms[room];

  if (persistedRoom) {
    const userIndex = persistedRoom.findIndex(
      (persistedUser) => persistedUser === user,
    );

    if (userIndex > -1) {
      persistedRoom.splice(userIndex, 1);
    }
  }

  logDev("rooms", rooms);
};

const isUserOnline = (user, room) => {
  let isOnline = false;
  const persistedRoom = rooms[room];

  if (persistedRoom) {
    const userSessions = persistedRoom.filter(
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
  const persistedRoom = rooms[room];

  if (persistedRoom) {
    onlineUsers = [...new Set(persistedRoom)]; // Remove duplicates

    // WARNING: Waiting for all promises to resolve means they are all being done in parallel.
    // This probably consumes too much memory when there're a lot of online users.
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

      if (!isUserOnline(username, room)) {
        socket.emit(
          "welcome_msg",
          formatMessage(
            "ChatBot",
            `Hello ${displayName}, Welcome to ${room} room. Please have a meaningful discussion!`,
          ),
        );
      }

      socket.on("send_message", async ({ message: dirtyMessage, date }) => {
        const message = sanitizeHtml(dirtyMessage);
        const cleanDate = sanitizeHtml(date);

        // console.log(`cleanDate`, cleanDate);
        // console.log(`You sent it at`, date);

        // console.log("dayjs", dayjs(date).format("dddd MMM YYYY h:mm a"));
        // console.log(
        //   "dayjs",
        //   dayjs(Number(cleanDate)).format("dddd MMM YYYY h:mm a"),
        // );

        if (message !== "" && cleanDate !== "") {
          // If the sent message is clean, send it and persist it

          const formattedMessage = formatMessage(
            displayName,
            message,
            Number(cleanDate),
          );

          io.to(room).emit("receive_message", formattedMessage);
          await Message.create({
            sender: userId,
            topic: id,
            text: message,
            date: formattedMessage.date,
          });
        }
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
