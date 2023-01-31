const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const randomId = () => crypto.randomBytes(16).toString("hex");


router.post("/createUser", async (req, res) => {
    const user = req.body;
    user.sessionID = randomId();
    user.userID = randomId();
    // Erstellen eines Eintrages in der MongoDB
    const newUser = new UserModel(user);
    await newUser.save();

    console.log("User created");
    // Rückgabe des Eintrages zum Vergleichen ob eintrag mit Usereingaben übereinstimmen
    res.json(user);
});




module.exports = router;
