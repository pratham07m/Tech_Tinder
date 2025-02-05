const express = require("express");
const { userAuth } = require("../middlewares/auth.js"); //middleware for cookie check
const { validateProfileEditData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { Error } = require("mongoose");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("user not found plz login" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("invalid Edit request");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.json({
      message: `${user.firstName} , your profile updated successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  const userpasswords = req.body;

  const user = req.user;
  const usercurruntPasword = userpasswords.curruntPasword;

  const isPasswordValid = await user.validatePassword(usercurruntPasword);

  if (isPasswordValid) {
    const updatedPassward = userpasswords.updatedpassword;

    if (!validator.isStrongPassword(updatedPassward)) {
      res.send("plase enter strong password"); //if we can not written else then we writted return on this line
    } else {
      const passwordHase = await bcrypt.hash(updatedPassward, 10);

      user.password = passwordHase;

      await user.save();

      res.cookie("token", null, { expires: new Date(Date.now()) });

      res.send("Password change successfuly plz re login first");
    }
  } else {
    res.status(400).json({
      message: "Your Password is Incorrect plz provide valid Password",
    });
  }
});

module.exports = profileRouter;
