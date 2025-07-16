const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); // import the userAuth middleware
const User = require("../models/user"); // import the User model



profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user; // user is attached to req in the middleware
    res.send(user); // Send the full user data
  } catch (err) {
    res.status(400).send("ERROR: " + err.message); 
  }
});

module.exports = profileRouter;
