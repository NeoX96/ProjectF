const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const MessageModel = require('./models/Messages');
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

// MongoDB Anfrage für alle Messages
app.get("/getMessages", (req, res) => {
    MessageModel.find({}, (err, result) => {
        if(err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// MongoDB Erstellen einer Message
app.post("/createMessage", async (req, res) => {
    const message = req.body;
    const newMessage = new MessageModel(message);
    await newMessage.save();
    
    // Rückgabe des Eintrages zum Vergleichen ob eintrag mit Usereingaben übereinstimmen
    res.json(message);
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

    // SocketIO User Connected Chat Bot
    socket.on("user_connected", (username) => {
        socket.username = username;
        socketIO.emit("user_connected", username);
        console.log(`Client ${socket.id}: ${socket.username} connected`);
    });


    // Store Message in MongoDB when sending and emit to all client
    socket.on("send_message", (message) => {
        console.log(message);
        socketIO.emit("receive_message", message);
        const newMessage = new MessageModel(message);
        newMessage.save();
    });

    // Emit to all clients that someone is disconnected
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id}: ${socket.username} disconnected`);
        socketIO.emit("user_disconnected", socket.username);
    });

    // set Username to specific socket client ID
    socket.on("set_username", (username) => {
        socket.username = username;
        console.log(socket.username);
        socketIO.emit("set_username", socket.username);
    });

    // get Messages from MongoDB and emit to client
    socket.on("get_messages", () => {
        MessageModel.find({}, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                socketIO.emit("get_messages", result);
            }
        });
    });
});


app.get("/api", (req, res) => {
    res.json({message: "Socket Test"})
});



http.listen(socketPort, () => {
  console.log(`SocketIO läuft auf http://localhost:${socketPort}/api`);
});