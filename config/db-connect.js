const mongoose = require("mongoose");
const { logDev } = require("./utils");

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;

    logDev("Connected to DB.");
  },
);
