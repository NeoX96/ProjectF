const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const MessageModel = require('./models/Messages');
const FriendModel = require('./models/Friends');
const routesAPI = require('./routes/routes');
const mongoPort = 4000;


dotenv.config();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000']
  }));
  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

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

// when server starts set all users to offline in MongoDB
UserModel.updateMany({
    online: true
}, {
    online: false
}, (err, res) => {
    if (err) throw err;
    console.log("All users set to offline");
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
            socket.name = session.vorname;
            socket._id = session._id;
            return next();
        }
        if (user) {
            console.log("username exists in MongoDB");

            socket.sessionID = user.sessionID;
            socket.id = user.userID;
            socket.username = user.username;
            socket.name = user.vorname;
            socket._id = user._id;
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
        username: socket.username,
        name: socket.name,
        _id: socket._id
    });

    socketIO.emit("user_connected", socket.username);
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
    socket.on("send_private_message", async (data) => {
        socket.to(data.targetUser).emit("receive_private_message", data);
        socket.emit("receive_private_message", data);

        const sender = await UserModel.findOne({userID: data.sender});
        const target = await UserModel.findOne({userID: data.targetUser});

        const message = new MessageModel({
            sender: sender._id,
            receiver: target._id,
            message: data.message,
            date: new Date()
        });
        try {
            await message.save();
            console.log("message saved successfully");
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("ask_private_messages", (data) => {
        // Find the sender user by ID
        UserModel.findOne({ userID: data.sender }, (err, sender) => {
            if (err) {
                console.log(err);
            } else {
                // Find the receiver user by ID
                UserModel.findOne({ userID: data.targetUser }, (err, receiver) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // Find all messages from sender to receiver
                        MessageModel.find({ $or: [{ sender: sender._id, receiver: receiver._id }, { sender: receiver._id, receiver: sender._id }] }, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                // Emit the messages to the client
                                socket.emit("get_private_messages", result);
                            }
                        });
                    }
                });
            }
        });
    
    });

    // Store Message in MongoDB when sending and emit to all client
    socket.on("send_message", (message) => {
        console.log(message);
        socketIO.emit("receive_message", message);
        const newMessage = new MessageModel(message);
        newMessage.save();
    });


    // search for users when someone wants to add a friend
    socket.on("search_user", (username) => {
        if(username && typeof username === 'string' && username.trim().length > 0){
            // live search in MongoDB for users and only return username and vorname
            UserModel.find({username: {$regex: username, $options: "i"}}, {username: 1, vorname: 1, _id: 1}, (err, result) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(result);
                    socket.emit("get_user", result);
                }
            });
        }
    });
    
    

    socket.on("send_friend_request", async (data) => {
        const { userId, friendId } = data;
        console.log("request"+ userId + " " + friendId);
        try {
            // check if user and friend exist
            const user = await UserModel.findById(userId);
            const friend = await UserModel.findById(friendId);
            if (!user || !friend) {
                socket.emit("friend_request_response", { success: false, message: "User or friend not found" });
                return;
            }
      
            // check if they are already friends
            const friendModel = await FriendModel.findOne({ friends: { $all: [userId, friendId] } });
            if (friendModel) {
                socket.emit("friend_request_response", { success: false, message: "You are already friends" });
                return;
            }
          
            //check if a friend request already sent
            const friendModelWithPending = await FriendModel.findOne({ pending: { $all: [userId, friendId] } });
            if (friendModelWithPending) {
                socket.emit("friend_request_response", { success: false, message: "Friend request already sent" });
                return;
            }
      
            // add friendId to user's pending array
            const updatedFriend = await FriendModel.findOneAndUpdate({ user: userId }, { $push: { pending: friendId } }, { new: true });
            
            if (updatedFriend) {
                console.log(updatedFriend);
                socket.emit("friend_request_response", { success: true, message: "Friend request sent" });
            }

        } catch (error) {
          console.log(error);
          socket.emit("friend_request_response", { success: false, message: "Error sending friend request" });
        }
      });


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


    socket.on("ask_friends", async () => {
        const onlineUsers = [];
        const offlineUsers = [];
        try {
            // Find the friend model for the current user
            const friendModel = await FriendModel.findOne({ userID: socket._id });
            if (!friendModel) {
                throw new Error("User does not have any friends");
            }
    
            // Iterate through the friends array and find the corresponding user
            for (const friend of friendModel.friends) {
                const user = await UserModel.findById(friend);
                if (!user) {
                    throw new Error(`User with ID ${friend} not found`);
                }
                if (user.online === true) {
                    onlineUsers.push(user);
                } else {
                    offlineUsers.push(user);
                }
            }
            // Emit the arrays to the client
            socket.emit("get_friends", onlineUsers, offlineUsers);
        } catch (error) {
            console.log(error);
            socket.emit("error", error.message);
        }
    });
    
    
    
    
});


app.get("/api", (req, res) => {
    res.json({message: "Socket Test"})
});



http.listen(socketPort, () => {
  console.log(`SocketIO läuft auf http://localhost:${socketPort}`);
});
