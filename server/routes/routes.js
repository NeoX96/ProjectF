const express = require('express');
const router = express.Router();
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

    // Das Passwort verschlüsseln
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    // Erstellen eines Eintrages in der MongoDB
    const newUser = new UserModel(user);
    await newUser.save();

    console.log("User created");
    // Rückgabe des Eintrages zum Vergleichen ob eintrag mit Usereingaben übereinstimmen
    res.json(user);
});

router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ error: "User not found" });
        }

        const password = req.body.password;
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password is incorrect");
          return res.status(400).json({ error: "Password is incorrect" });
        }

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username
        }, JWTSEC);

        user.sessionID = accessToken;
        await user.save();

        res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurred" });
    }
});



router.post('/validateSession', async (req, res) => {
    const sessionID = req.body.sessionID;
  
    try {
      const user = await UserModel.findOne({ sessionID: sessionID });

      // If user is found, return true
      if (user) {
        console.log('SessionID found');
        res.status(200).json({ isValid: true });
      } else {
        console.log('SessionID not found');
        res.status(401).json({ isValid: false });
      }

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });


module.exports = router;
