const mongoose = require("mongoose")

const conectionRequestSchema = new mongoose.Schema({

  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // referance to the user collection
    required: true
  },

  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true

  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`
    }
  }
}, { timestamps: true });

conectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

conectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  //check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("you cannot send connection request to Yourself !!!")
  }
  next();
});

const ConectionRequestModel = new mongoose.model("ConnectionRequest", conectionRequestSchema);

module.exports = ConectionRequestModel;