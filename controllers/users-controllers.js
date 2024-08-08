const { fetchUserData, fetchUserByUsername } = require("../models/user-models");

exports.sendUserData = (req, res, next) => {
  fetchUserData()
    .then((userData) => {
      res.status(200).send({ userData });
    })
    .catch(next);
};

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((userData) => {
      res.status(200).send({ userData });
    })
    .catch(next);
};
