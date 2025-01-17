const express = require("express");
const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt") // use for password hash and compair password to hash password


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try {
        //validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body

        //Encrypt the password
        const passwordHase = await bcrypt.hash(password, 10);

        //creating a new instance of user model
        const user = new User({
            firstName, lastName, emailId, password: passwordHase
        });

        await user.save();
        res.send("User Added successfully");

    } catch (err) {
        res.status(400).send("Error saving the user" + err.message);
    }
});


authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            // throw new Error("emailId not present");
            res.send("user not found");
        }

        const isPasswordValid = await user.validatePassword(password) //function call from model/user.js
        if (isPasswordValid) {

            //Create a JWT Token
            const token = await user.getJWT(); //token creation in models/user.js

            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.send("Login successfull");
        }
        else {
            res.send("password is not valid")
        }

    } catch (err) {
        res.status(400).send("user not found");
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("logout successfully")
});


module.exports = authRouter;