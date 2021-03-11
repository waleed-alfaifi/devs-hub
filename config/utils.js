// Convert express middleware to socket.io middleware
exports.wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
