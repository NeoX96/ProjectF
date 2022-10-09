const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');

mongoose.connect(
    "mongodb+srv://valentin:ProjektPasswort@projectf.iserctp.mongodb.net/ProjectF?retryWrites=true&w=majority"
);

// MongoDB Anfrage für alle Users
app.get("/getUsers", (req, res) => {
    UserModel.find({}, (err, result) => {
        if(err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

app.listen(3001, () => {
    console.log("Server läuft auf Port 3001");
});
