const topicsRouter = require("express").Router();
const { sendTopicData } = require("../controllers/topics-controllers");

topicsRouter.route("/").get(sendTopicData);

module.exports = topicsRouter;
