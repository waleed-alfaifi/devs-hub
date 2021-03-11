const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const sessionMiddleware = session({
  secret: "test secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // TODO: Make true when deploying
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
  }),
});

module.exports = sessionMiddleware;
