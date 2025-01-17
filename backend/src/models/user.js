const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,

    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) { //validate email
                throw new Error("Invalid email address")
            }
        },
    },

    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("enter strong password");
            }
        }
    },

    age: {
        type: Number,
    },

    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`,
        },
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid");
        //     }
        // }
    },

    photoUrl: {
        type: String,
        default: "https://picsum.photos/seed/picsum/200/300",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("invalid photo URL" + value);
            }
        },
    },

    about: {
        type: String,
        default: "this is a default about of the user!"
    },

    Skills: {
        type: [String],
    },
}, { timestamps: true });

//get token from user
userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@TinderBy_Pratham", { expiresIn: "1d" });

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash); //compare user password to hash password
    return isPasswordValid;
}


module.exports = mongoose.model("User", userSchema);