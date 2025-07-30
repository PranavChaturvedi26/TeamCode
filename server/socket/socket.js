import { Server } from "socket.io";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    socket.on("join-project-room", (projectRoomId) => {
      console.log(` ${socket.id} joined project room: ${projectRoomId}`);

      const projectId = projectRoomId.replace("room-", "");
      console.log("socket.handshake.auth:", socket.handshake.auth);
      socket.data.projectId = projectId;
      socket.data.username = socket.handshake.auth.username;
      socket.data.userId = socket.handshake.auth.userId;

      socket.join(projectRoomId);

      // Optional: broadcast presence
      socket
        .to(projectRoomId)
        .emit("project-user-joined", { username: socket.data.username });
      const users = getUsersInProject(projectId);
      io.to(projectRoomId).emit("project-user-map", users);
    });

    socket.on("run-code", async ({ projectId, language, code }) => {
      console.log(`Running ${language} code for project ${projectId}`);

      try {
        const tempDir = path.join(__dirname, "../temp", projectId);
        await fs.mkdir(tempDir, { recursive: true });

        let fileName, command;

        switch (language) {
          case "javascript":
            fileName = "script.js";
            command = `node "${path.join(tempDir, fileName)}"`;
            break;
          case "python":
            fileName = "script.py";
            command = `python "${path.join(tempDir, fileName)}"`;
            break;
          case "java":
            fileName = "Main.java";
            command = `cd "${tempDir}" && javac Main.java && java Main`;
            break;
          case "cpp":
            fileName = "main.cpp";
            command = `cd "${tempDir}" && g++ main.cpp -o main && ./main`;
            break;
          case "c":
            fileName = "main.c";
            command = `cd "${tempDir}" && gcc main.c -o main && ./main`;
            break;
          case "typescript":
            fileName = "script.ts";
            command = `cd "${tempDir}" && npx ts-node script.ts`;
            break;
          case "go":
            fileName = "main.go";
            command = `cd "${tempDir}" && go run main.go`;
            break;
          case "rust":
            fileName = "main.rs";
            command = `cd "${tempDir}" && rustc main.rs && ./main`;
            break;
          case "php":
            fileName = "script.php";
            command = `php "${path.join(tempDir, fileName)}"`;
            break;
          case "ruby":
            fileName = "script.rb";
            command = `ruby "${path.join(tempDir, fileName)}"`;
            break;
          default:
            socket.emit(
              "code-error",
              `Language ${language} not supported for execution`
            );
            return;
        }

        await fs.writeFile(path.join(tempDir, fileName), code);

        exec(
          command,
          { timeout: 30000, maxBuffer: 1024 * 1024 },
          (error, stdout, stderr) => {
            if (error) {
              console.error("Execution error:", error);
              socket.emit("code-output", {
                error: stderr || error.message,
              });
            } else {
              socket.emit("code-output", {
                output: stdout || "Code executed successfully (no output)",
              });
            }

            fs.rm(tempDir, { recursive: true, force: true }).catch(
              console.error
            );
          }
        );
      } catch (error) {
        console.error("Error running code:", error);
        socket.emit("code-error", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  return io;
};
