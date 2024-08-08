const userRouter = require("express").Router();
const { sendUserData, sendUserByUsername } = require("../controllers/users-controllers");

userRouter.route("/").get(sendUserData);

userRouter.route("/:username").get(sendUserByUsername)

module.exports = userRouter;