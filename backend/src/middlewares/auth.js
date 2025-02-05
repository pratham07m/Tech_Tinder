const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {

    //Read the token from req cookies
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("please Login");
        }

        const decodedObj = await jwt.verify(token, "DEV@TinderBy_Pratham");

        const { _id } = decodedObj;
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("user not found")
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("Error :" + err.message)
    }

};

module.exports = {
    userAuth,
}