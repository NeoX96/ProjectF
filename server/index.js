const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');

app.use(express.json());

// MongoDB Connection URL
mongoose.connect(
    "mongodb+srv://valentin:ProjektPasswort@projectf.iserctp.mongodb.net/ProjectF?retryWrites=true&w=majority"
);

// MongoDB Anfrage für alle Users + ausgabe wenn Error
app.get("/getUsers", (req, res) => {
    UserModel.find({}, (err, result) => {
        if(err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// MongoDB Erstellen eines Users
app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();

    // Rückgabe des Eintrages zum Vergleichen ob eintrag mit Usereingaben übereinstimmen
    res.json(user);
});

app.listen(3001, () => {
    console.log("Server läuft auf Port 3001");
});
