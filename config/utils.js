const dayjs = require("dayjs");
// Convert express middleware to socket.io middleware
exports.wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

exports.formatMessage = (user, message) => {
  const formattedMessage = {
    user,
    message,
    date: dayjs().format("h:mm a"),
  };

  return formattedMessage;
};
