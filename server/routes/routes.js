const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');
const MessageModel = require('../models/Messages');
const dotenv = require('dotenv');
dotenv.config();


router.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();

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


module.exports = router;
