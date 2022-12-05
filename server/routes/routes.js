
const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');


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


router.get('/signin')
module.exports = router