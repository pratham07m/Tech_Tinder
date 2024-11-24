const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js")
const User = require("../models/user.js")

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type : " + status })
        }

        //find existing user on DB
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("User not Found");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).send("Connection Request Already Exist!!!");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status,
        });

        const data = await connectionRequest.save();

        res.json({ message: req.user.firstName + " " + "is" + " " + status + " " + "in" + " " + toUser.firstName, data })

    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // const status = req.params.status
        // const requestId = req.params.requestId

        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("invalid status");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });


        if (!connectionRequest) {
            return res.status(400).send("connection request not found")
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request" + status, data })

        //validate the status
        //fromUserId => toUserId
        //loggedIn === toUserId
        //status = interested
        //request Id should be valid

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})

module.exports = requestRouter;