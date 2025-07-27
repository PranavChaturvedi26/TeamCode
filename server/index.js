const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./db/connectDB");
dotenv.config();

connectDB().then(() => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
