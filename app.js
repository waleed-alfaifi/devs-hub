const path = require("path");
const http = require("http");
const createError = require("http-errors");
const express = require("express");
const socketIO = require("socket.io");
const logger = require("morgan");
const passport = require("passport");
const isAuthenticated = require("./middleware/auth").isAuthenticated;
const socketHandler = require("./config/socket-handler");
const wrap = require("./config/utils").wrap;

require("dotenv").config();
require("./config/db-connect");
require("./config/passport")(passport);

const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const chatRouter = require("./routes/chat");
const topicRouter = require("./routes/topic");
const { logDev } = require("./config/utils");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middleware
app.use(logger("dev"));
app.use(require("./middleware/session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.use(wrap(require("./middleware/session")));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

socketHandler(io);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/chat", isAuthenticated, chatRouter);
app.use("/topic", isAuthenticated, topicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(PORT, () => {
  logDev(`server listening on port ${PORT}`);
});
