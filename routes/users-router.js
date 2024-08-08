const userRouter = require("express").Router();
const { sendUserData } = require("../controllers/users-controllers");

userRouter.route("/").get(sendUserData);

module.exports = userRouter;