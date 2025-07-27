const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/codepen";
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
// connectDB.js
