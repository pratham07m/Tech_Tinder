const express = require("express");
const connectDB = require("./config/database.js")
const app = express();
const cookieParser = require("cookie-parser"); //user for reading cookies

app.use(express.json()); // middelware for json data
// app.use(express.urlencoded);
app.use(cookieParser()); //use for reading cookies 


const authRouter = require("./routes/auth.js");

const profileRouter = require("./routes/profile.js");

const requestRouter = require("./routes/request.js");

const userRouter = require("./routes/user.js");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);




connectDB().then(() => {
    console.log("DB connect");

    app.listen(3000, () => {
        console.log("server startd");
    });
})
    .catch((err) => {
        console.log("DB connection error");
    });

 // onother way to handel apis but it not sutabel for big project
//save user from database (signUp)
// app.post("/signup", async (req, res) => {

//     try {
//         //validation of data
//         validateSignUpData(req);

//         const { firstName, lastName, emailId, password } = req.body
//         //Encrypt the password
//         const passwordHase = await bcrypt.hash(password, 10)



//         //creating a new instance of user model
//         const user = new User({
//             firstName, lastName, emailId, password: passwordHase
//         });


//         await user.save();
//         res.send("User Added successfully");
//     } catch (err) {
//         res.status(400).send("Error saving the user" + err.message);
//     }
// });


// //login
// app.post("/login", async (req, res) => {
//     try {
//         const { emailId, password } = req.body;

//         const user = await User.findOne({ emailId: emailId });

//         if (!user) {
//             // throw new Error("emailId not present");
//             res.send("user not found");
//         }

//         const isPasswordValid = await user.validatePassword(password) //function call from model/user.js
//         if (isPasswordValid) {

//             //Create a JWT Token
//             const token = await user.getJWT(); //token creation in models/user.js
         

//             //Add the token to cookie and send the response back to the user
//             res.cookie("token", token, {
//                 expires: new Date(Date.now() + 8 * 3600000),
//             });

//             res.send("Login successfull");
//         }
//         else {
//             throw new Error("password is not valid")
//         }

//     } catch (err) {
//         res.status(400).send("user not found" + err.message);
//     }
// });


// //get user profile
// app.get("/profile", userAuth, async (req, res) => {
//     try {

//         const user = req.user;
//         res.send(user)

//     } catch (err) {
//         res.status(400).send("user not found plz login" + err.message);
//     }
// });


// //get all user from database
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }
// });


// //get user by emailId
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;
//     try {
//         const users = await User.find({ emailId: userEmail });
//         res.send(users);
//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }
// });


// //delet user by ID
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId
//     try {
//         await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully")
//     } catch (error) {
//         res.status(400).send("something went wrong");
//     }
// });


// //update data of the user
// app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;

//     try {
//         const ALLOWED_UPDATES = ["age", "lastName"];
//         const isUpdateAllowed = Object.keys(data).every((k) =>
//             ALLOWED_UPDATES.includes(k)
//         );
//         if (!isUpdateAllowed) {
//             throw new Error("update not allowed");
//         }
//         const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//             returnDocument: "after", //gave data after update 
//             runValidators: true,//use for validating data
//         });
//         res.send("user updated successfully");
//     } catch (error) {
//         res.status(400).send("somthing went wrong")
//     }
// });


// const { adminAuth } = require("./middlewares/auth.js")


// //midlleware

// //midlleware logic for check authorized admin
// app.use("/admin", adminAuth);

// //routes
// app.get("/user", (req, res) => {
//     res.send("USER data send")
// });

// app.get("/admin/GetAllData", (req, res) => {
//     res.send("get all DATA")
// });

// app.delete("/admin/DeletUser", (req, res) => {
//     res.send("delet user by admin")
// })