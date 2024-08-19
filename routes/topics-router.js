const topicsRouter = require("express").Router();
const { sendTopicData, postTopicData } = require("../controllers/topics-controllers");

topicsRouter.route("/").get(sendTopicData).post(postTopicData);

module.exports = topicsRouter;
