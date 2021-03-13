const createError = require("http-errors");

exports.isAuthenticated = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/"); // Some warning message
  }
};

exports.socket = function (socket, next) {
  const { user } = socket.request;

  if (!user) {
    next(createError(401, { message: "Unauthorized connection" }));
  } else {
    next();
  }
};
