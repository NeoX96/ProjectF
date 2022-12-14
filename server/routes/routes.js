const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');
const MessageModel = require('../models/Messages');
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

router.get("/getUsers", async (req, res) => {
    const users = await UserModel.find({});
    res.json(users);
});


// MongoDB Anfrage für alle Messages
router.get("/getMessages", (req, res) => {
    MessageModel.find({}, (err, result) => {
        if(err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// MongoDB Erstellen einer Message
router.post("/createMessage", async (req, res) => {
    const message = req.body;
    const newMessage = new MessageModel(message);
    await newMessage.save();
    
    // Rückgabe des Eintrages zum Vergleichen ob eintrag mit Usereingaben übereinstimmen
    res.json(message);
});

// get specific user by sessionID
router.get("/getUserBySessionID/:sessionID", async (req, res) => {
    const sessionID = req.params.sessionID;
    const user = await UserModel.findOne({sessionID: sessionID});
    res.json(user);
});


module.exports = router;
