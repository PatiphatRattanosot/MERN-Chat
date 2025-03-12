const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log("Database connected : ", conn.connection.host);
  } catch (error) {
    console.log("Database connection error : ", error);
  }
};
