const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect successfully !");
  } catch (error) {
    console.error("Error:", error);

    console.log("Connect failure !");
  }
}

module.exports = { connect };
