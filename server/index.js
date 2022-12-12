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

app.use(routesAPI);


app.listen(mongoPort, () => {
    console.log(`MongoDB backend Server auf http://localhost:${mongoPort}`);
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


socketIO.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    const username = socket.handshake.auth.username;

    if (sessionID || username) {

        const session = await UserModel.findOne({sessionID: sessionID});
        const user = await UserModel.findOne({username: username});

        // if sessionID or username exists in MongoDB
        if (session) {
            console.log("sessionID exists in MongoDB");
            socket.sessionID = sessionID;
            socket.id = session.userID;
            socket.username = session.username;
            return next();
        }
        if (user) {
            console.log("username exists in MongoDB");

            socket.sessionID = user.sessionID;
            socket.id = user.userID;
            socket.username = user.username;
            return next();
        } else {
            // return error if username does not exist in MongoDB
            console.log("username does not exist in MongoDB");
            return next(new Error("username does not exist in MongoDB"));
        }
    } else {
        console.log("sessionID and username does not exist");
        // return error if sessionID and username does not exist
        return next(new Error("sessionID and username does not exist"));
    }
    });



socketIO.on("connection", (socket) => {
    console.log(`Client ${socket.id}: ${socket.username} connected`);
    // search username in MongoDB
    const user = UserModel.findOne({username: socket.username});

    // if user does not exist in MongoDB dont go in Update One
    if (user) {
    UserModel.updateOne({
        username: socket.username
    }, {
        sessionID: socket.sessionID,
        userID: socket.id,
        online: true
    }, {
        upsert: true
    }, (err, res) => {
        if (err) throw err;
        console.log(res);
    });
    }

      // emit session details
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.id,
        username: socket.username
    });

    // SocketIO User Connected Chat Bot
    socket.on("user_connected", (username) => {
        socketIO.emit("user_connected", username);
        console.log(`Client ${socket.id}: ${socket.username} connected`);
    });

    // Emit to all clients that someone is disconnected
    socket.on("disconnect", () => {
        // set user offline in MongoDB
        UserModel.updateOne({
            username: socket.username
        }, {
            online: false
        }, (err, res) => {
            if (err) throw err;
            console.log(res);
        });
        console.log(`Client ${socket.id}: ${socket.username} disconnected`);
        socketIO.emit("user_disconnected", socket.username);
        socket.disconnect();
    });

    // send private message to target user 
    socket.on("send_private_message", (data) => {
        socket.to(data.targetUser).emit("receive_private_message", data);
        socket.emit("receive_private_message", data);
        console.log(data);
    });

    // Store Message in MongoDB when sending and emit to all client
    socket.on("send_message", (message) => {
        console.log(message);
        socketIO.emit("receive_message", message);
        const newMessage = new MessageModel(message);
        newMessage.save();
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

                // push the users in the right array
                result.forEach((user) => {
                    if(user.online === true) {
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