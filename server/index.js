import dotenv from "dotenv";
import express from "express";
import https from "https";
import fs from "fs";

import cors from "cors";
import connectDB from "./db/connectDB.js";
import CreateProjectController from "./controller/CreateProjectController.js";
//Socket
import { setupSocketIO } from "./socket/socket.js";
import { set } from "mongoose";
dotenv.config();
const sslOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};
const app = express();
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.post("/create-project", CreateProjectController.createProject);
setupSocketIO(app);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
