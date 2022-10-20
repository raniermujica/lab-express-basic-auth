const express = require("express");
const User = require("../models/User.model");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/auth.middlewares.js");

//GET "/profile"
router.get("/", isLoggedIn, (req, res, next) => {
  console.log("Usuario que hace la solicitud", req.session.activeUser);

  User.findById(req.session.activeUser._id)
    .then((response) => {
      res.render("profile/my-profile.hbs", {
        userDetails: response,
      });
    })
    .catch((error) => {
      next(error);
    });

  res.render("profile/my-profile.hbs");
});

//POST ("/main")
router.get("/main", isLoggedIn, (req, res, next) => {
  console.log("Usuario que hace la solicitud", req.session.activeUser);

  User.findById(req.session.activeUser._id)
    .then((response) => {
      res.render("profile/main.hbs", {
        userCats: response,
      });
    })
    .catch((error) => {
      next(error);
    });

  res.render("profile/main.hbs");
});

module.exports = router;
