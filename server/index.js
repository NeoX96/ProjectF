const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
app.use(express.json());
const mongoPort = 4000;

// MongoDB Connection URL
mongoose.connect(
    "mongodb+srv://valentin:ProjektPasswort@projectf.iserctp.mongodb.net/ProjectFDB?retryWrites=true&w=majority"
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

app.listen(mongoPort, () => {
    console.log(`MongoDB backend Server auf http://localhost:${mongoPort}/getUsers`);
});



// ---------------------------------------------------------------- //


// SocketIO Chat
const http = require('http').Server(app);
const socketPort = 4001;
const cors = require("cors");
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

socketIO.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);
    // emit to all clients that someone is connected with username
    socketIO.emit("user_connected", socket.id);

    socket.on("send_message", (data) => {
        socketIO.emit("receive_message", data);
        console.log(data);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Emit to everyone that ID disconnected
        socketIO.emit("user_disconnected", socket.id);
    })

    // set username
    socket.on("set_username", (data) => {
        socketIO.emit("set_username", data);
    })

});


app.get("/api", (req, res) => {
    res.json({message: "Socket Test"})
});



http.listen(socketPort, () => {
  console.log(`SocketIO läuft auf http://localhost:${socketPort}/api`);
});