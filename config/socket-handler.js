const auth = require("../middleware/auth");

module.exports = function (io) {
  io.use(auth.socket);

  io.on("connection", (client) => {
    client.emit("welcome_msg", { message: "You are my best friend" });

    console.log("---------------- welcome client! ----------------");
  });
};
