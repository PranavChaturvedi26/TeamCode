const express = require("express");
const dotenv = require("dotenv");
const app = require("./index.js");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api");
app.post("/api/create-project", CreateProjectController.createProject);

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
