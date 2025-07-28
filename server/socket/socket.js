import { Server } from "socket.io";
export const setupSocketIO = (httpsServer) => {
  const io = new Server(httpsServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const getUsersInProject = (projectId) => {
    const users = [];
    io.of("/").sockets.forEach((socket) => {
      if (socket.data.projectId === projectId) {
        users.push(socket.data.username);
      }
    });
    return users;
  };

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
