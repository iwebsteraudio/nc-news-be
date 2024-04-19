const { fetchUserData } = require("../models/user-models");

exports.sendUserData = (req, res, next) => {
  fetchUserData()
    .then((userData) => {
      res.status(200).send({ userData });
    })
    .catch(next);
};
