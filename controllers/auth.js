const User = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// GET /auth/sign-up
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up", { title: "Sign Up!" });
});

// GET /auth/sign-out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// POST /auth/sign-up
router.post("/sign-up", async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("Passwords do not match");
    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      details: {
        name: req.body.name,
        bio: req.body.bio,
      },
    });
    req.session.user_id = user._id;
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
    res.render("auth/sign-up", { title: "Sign Up!" });
  }
});

// GET /auth/sign-in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in", { title: "Sign In" });
});

// POST /auth/sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error("Invalid username");
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) throw new Error("Invalid password");
    req.session.user_id = user._id;
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
    res.render("auth/sign-in", { title: "Sign In" });
  }
});

module.exports = router;
