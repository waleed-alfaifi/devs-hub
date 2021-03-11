// This is where the client magic happens.
const socket = io();

socket.on("welcome_msg", ({ message }) => {
  console.log("message", message);
});
