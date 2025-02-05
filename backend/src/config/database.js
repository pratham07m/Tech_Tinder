const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://pratham2004m:pratham2004@cluster0.2qvwh.mongodb.net/devTinder");
};

module.exports = connectDB;


