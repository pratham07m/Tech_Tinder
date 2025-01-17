const express = require("express")
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js")
const User = require("../models/user.js")

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"]); //populate use for data show from DB


        res.json({ message: "Data fetched Successfully", data: connectionRequest })

    } catch (error) {
        req.status(400).send("invalid request")
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", ["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"]);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId;
        })
        res.json({ data })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
});

userRouter.get("/user/feeds", userAuth, async (req, res) => {
    try {
        //User should see all the user cards except
        // his own card
        //his connections
        //ignored , connection request

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit // set one time limitation 

        const skip = (page - 1) * limit; // fromula = (page-1)*limit   //limit=10

        //find all connection request (sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId  toUserId")

        const hideUsersFromFeeds = new Set();
        connectionRequest.forEach(req => {
            hideUsersFromFeeds.add(req.fromUserId.toString());
            hideUsersFromFeeds.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeeds) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select("firstName lastName").skip(skip).limit(limit);

        res.send(users);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = userRouter;