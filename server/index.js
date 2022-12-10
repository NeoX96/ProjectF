const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const MessageModel = require('./models/Messages');
const routesAPI = require('./routes/routes');
const mongoPort = 4000;

dotenv.config();
app.use(express.json());
app.use(cors({
    origin: 'localhost:3000'
}));

// MongoDB Connection URL
mongoose.connect(process.env.DATABASE_ACCESS, () => console.log("Database connected"));

app.use('/', routesAPI);



app.listen(mongoPort, () => {
    console.log(`MongoDB backend Server auf http://localhost:${mongoPort}/getUsers`);
});



// ---------------------------------------------------------------- //


// SocketIO Chat
const socketPort = 4001;
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});



socketIO.on("connection", (socket) => {

    // SocketIO User Connected Chat Bot
    socket.on("user_connected", (username) => {
        socket.username = username;
        socketIO.emit("user_connected", username);
        console.log(`Client ${socket.id}: ${socket.username} connected`);
    });

    // Emit to all clients that someone is disconnected
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id}: ${socket.username} disconnected`);
        socketIO.emit("user_disconnected", socket.username);
        socket.disconnect();
    });


    // Store Message in MongoDB when sending and emit to all client
    socket.on("send_message", (message) => {
        console.log(message);
        socketIO.emit("receive_message", message);
        const newMessage = new MessageModel(message);
        newMessage.save();
    });

    // set Username to specific socket client ID
    socket.on("set_username", (username) => {
        socket.username = username;
        console.log(socket.username);
        socketIO.broadcast.emit("set_username", socket.username);
    });

    // get Messages from MongoDB and emit to client
    socket.on("ask_messages", () => {
        MessageModel.find({}, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                socket.emit("get_messages", result);
            }
        });
       
    });

    // get Users from MongoDB, check if they are online/offline and emit to client
    socket.on("ask_users", () => {
        const onlineUsers = [];
        const offlineUsers = [];

        UserModel.find({}, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                // compare the Name with the all connected users
                result.forEach((user) => {
                    socketIO.sockets.sockets.forEach((socket) => {
                        if(user.name === socket.username) {
                            user.connected = true;
                        }
                        });
                });

                // push the users in the right array
                result.forEach((user) => {
                    if(user.connected === true) {
                        onlineUsers.push(user);
                    } else {
                        offlineUsers.push(user);
                    }
                });

                // emit the arrays to the client
                socket.emit("get_users", onlineUsers, offlineUsers);
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