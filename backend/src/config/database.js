const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(Databse URL);
};

module.exports = connectDB;


