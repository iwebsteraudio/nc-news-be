const topicsRouter = require("express").Router();
const { sendTopicData, postTopicData, sendArticleByTopic } = require("../controllers/topics-controllers");

topicsRouter.route("/").get(sendTopicData).post(postTopicData);

topicsRouter.route("/:topic/articles").get(sendArticleByTopic)

module.exports = topicsRouter;
