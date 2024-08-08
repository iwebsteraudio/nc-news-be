const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articleRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const commentRouter = require("./comment-router")
const apiData = require("../endpoints.json");

apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter)


apiRouter.route("/").get((req, res,) => {
  res.status(200).send(apiData);
});

module.exports = apiRouter;
