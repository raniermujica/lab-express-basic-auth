const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// GET "/auth/signup"
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup"
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Debes llenar todos los campos",
    });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "La contraseña debe tener minimo 8 caracteres, una mayuscula y un numero",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ username: username });
    console.log(foundUser);
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Usuario ya creado con ese nombre",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username: username,
      email: email,
      password: hashPassword,
    };

    await User.create(newUser);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// GET "/auth/login"
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST "auth/login"
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Los campos deben estar completos",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ username: username });
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas",
      });
      return;
    }
    //!
    req.session.activeUser = foundUser;
    //!
    req.session.save(() => {
      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});

// GET "/auth/logout"
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
