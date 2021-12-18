const localData = require("dayjs/plugin/localeData");
const dayjs = require("dayjs");

dayjs.extend(localData);

// Convert express middleware to socket.io middleware
exports.wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

exports.formatMessage = (user, message, date) => {
  const formattedMessage = {
    user,
    message,
    date: dayjs(date).format("h:mm a"),
  };

  return formattedMessage;
};

exports.logDev = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};
