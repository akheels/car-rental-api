const express = require("express");
const types = require("../routes/types");
const cars = require("../routes/cars");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const register = require("../routes/register");
const login = require("../routes/login");
const users = require("../routes/users");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());

  // register route
  app.use("/api/register", register);

  // login route
  app.use("/api/login", login);

  // cars route
  app.use("/api/cars", cars);

  // types route
  app.use("/api/types", types);

  // rentals route
  app.use("/api/rentals", rentals);

  // returns route
  app.use("/api/returns", returns);

  // users route
  app.use("/api/users", users);

  app.use(error);
};
