const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const JWTSEC = process.env.JWTSEC;

const UserModel = require('../models/Users');
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

router.post("/login", async (req, res) => {
    console.log(req.body);
    console.log("login");
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: "Some error occurred" });
    }

    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Password error" });
        }

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username
        }, JWTSEC);

        if (accessToken) {
            user.sessionID = accessToken;
            await user.save();
        }

        res.status(200).json({ accessToken: `${accessToken}` });
    } catch (error) {
        res.status(500).json({ error: "Internal error occurred" });
    }
});



module.exports = router;
