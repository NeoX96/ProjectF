const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const MessageModel = require("./models/Messages");
const FriendModel = require("./models/Friends");
const routesAPI = require("./routes/routes");
const mongoPort = 4000;

dotenv.config();
app.use(express.json());
const allowedOrigins = [
  "https://www.gonkle.de http://www.gonkle.de https://gonkle.de",
  "http://gonkle.de",
  "http://localhost:3000",
];

app.use(
  cors({
    origins: allowedOrigins,
  })
);

app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// MongoDB Connection URL
mongoose.connect(process.env.DATABASE_ACCESS, () =>
  console.log("Database connected")
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  next();
});

app.use(routesAPI);

app.listen(mongoPort, () => {
  console.log(`MongoDB backend Server auf http://localhost:${mongoPort}`);
});

// ---------------------------------------------------------------- //

// SocketIO Chat
const socketPort = 4001;
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origins: allowedOrigins,
  },
});

socketIO = io.of("/socket");

// when server starts set all users to offline in MongoDB
UserModel.updateMany(
  {
    online: true,
  },
  {
    online: false,
  },
  (err, res) => {
    if (err) throw err;
    console.log("All users set to offline");
  }
);

socketIO.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const username = socket.handshake.auth.username;

  if (sessionID || username) {
    const session = await UserModel.findOne({ sessionID: sessionID });
    const user = await UserModel.findOne({ username: username });

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
  console.log(`Client ${socket._id}: ${socket.username} connected`);
  // search username in MongoDB
  const user = UserModel.findOne({ username: socket.username });

  // if user does not exist in MongoDB dont go in Update One
  if (user) {
    UserModel.updateOne(
      {
        username: socket.username,
      },
      {
        sessionID: socket.sessionID,
        userID: socket.id,
        online: true,
      },
      {
        upsert: true,
      },
      (err, res) => {
        if (err) throw err;
        console.log(res);
      }
    );
  }

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.id,
    username: socket.username,
    name: socket.name,
    _id: socket._id,
  });

  socketIO.emit("user_connected", socket.username);

  // SocketIO User Connected Chat Bot
  socket.on("user_connected", (username) => {
    socketIO.emit("user_connected", username);
    console.log(`Client ${socket._id}: ${socket.username} connected`);
  });

  // Emit to all clients that someone is disconnected
  socket.on("disconnect", () => {
    // set user offline in MongoDB
    UserModel.updateOne(
      {
        username: socket.username,
      },
      {
        online: false,
      },
      (err, res) => {
        if (err) throw err;
        console.log(res);
      }
    );
    console.log(`Client ${socket._id}: ${socket.username} disconnected`);
    socketIO.emit("user_disconnected", socket.username);
    socket.disconnect();
  });

  // send private message to target user
  socket.on("send_private_message", async (data) => {
    data.date = new Date();

    socket.to(data.targetUser).emit("receive_private_message", data);
    socket.emit("receive_private_message", data);

    const sender = await UserModel.findOne({ userID: data.sender });
    const target = await UserModel.findOne({ userID: data.targetUser });

    const message = new MessageModel({
      sender: sender._id,
      receiver: target._id,
      message: data.message,
      date: data.date,
    });
    try {
      await message.save();
      console.log("message saved successfully");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("ask_private_messages", async (data) => {
    try {
      const sender = await UserModel.findOne({ userID: data.sender });
      if (!sender) {
        console.log("Sender not found");
        return;
      }

      const receiver = await UserModel.findOne({ userID: data.targetUser });
      if (!receiver) {
        console.log("Receiver not found");
        return;
      }

      const result = await MessageModel.find({
        $or: [
          { sender: sender._id, receiver: receiver._id },
          { sender: receiver._id, receiver: sender._id },
        ],
      });

      socket.emit("get_private_messages", result);
    } catch (err) {
      console.log(err);
    }
  });

  // search for users when someone wants to add a friend
  socket.on("search_user", (username) => {
    if (
      username &&
      typeof username === "string" &&
      username.trim().length > 0
    ) {
      // live search in MongoDB for users and only return username and vorname
      UserModel.find(
        { username: { $regex: username, $options: "i" } },
        { username: 1, vorname: 1, _id: 1 },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            // filter the results to exclude the current user
            const filteredResult = result.filter(
              (user) => String(user._id) !== String(socket._id)
            );
            socket.emit("get_user", filteredResult);
          }
        }
      );
    }
  });

  socket.on("send_friend_request", async (friendId) => {
    console.log("request: " + socket._id + " " + friendId);
    try {
      // check if user and friend exist
      const user = await UserModel.findById(socket._id);
      const friend = await UserModel.findById(friendId);

      if (!user || !friend) {
        console.log("User or friend not found");
        socket.emit("friend_request_response", {
          success: false,
          message: "User or friend not found",
        });
        return;
      }

      // check if the friendId is the same as the user's ID
      if (String(socket._id) === String(friendId)) {
        console.log("Cannot add yourself as a friend");
        socket.emit("friend_request_response", {
          success: false,
          message: "Cannot add yourself as a friend",
        });
        return;
      }

      // check if they are already friends for both users
      const friendModel = await FriendModel.findOne({
        user: socket._id,
        friends: { $in: [friendId] },
      });
      const userModel = await FriendModel.findOne({
        user: friendId,
        friends: { $in: [socket._id] },
      });
      if (friendModel || userModel) {
        console.log("You are already friends");
        socket.emit("friend_request_response", {
          success: false,
          message: "You are already friends",
        });
        return;
      }

      //check if a friend request already sent
      const friendModelWithPending = await FriendModel.findOne({
        user: friendId,
        pending: { $in: [socket._id] },
      });
      if (friendModelWithPending) {
        console.log("Friend request already sent");
        socket.emit("friend_request_response", {
          success: false,
          message: "Friend request already sent",
        });
        return;
      }

      // add friendId to user's pending array
      const updatedFriend = await FriendModel.findOneAndUpdate(
        { user: friendId },
        { $push: { pending: socket._id } },
        { new: true, upsert: true }
      );

      if (updatedFriend) {
        console.log(updatedFriend);
        socket.emit("friend_request_response", {
          success: true,
          message: "Friend request sent",
        });
        return;
      }
      console.log("empty");
    } catch (error) {
      console.log(error);
      socket.emit("friend_request_response", {
        success: false,
        message: "Error sending friend request",
      });
    }
  });

  socket.on("ask_friends", async () => {
    const onlineUsers = [];
    const offlineUsers = [];
    try {
      // Find the friend model for the current user
      const friendModel = await FriendModel.findOne({ user: socket._id });
      if (!friendModel) {
        // lege ein neues FriendModel an
        const newFriendModel = new FriendModel({
          user: socket._id,
          friends: [],
          pending: [],
          blocked: [],
        });
        await newFriendModel.save();
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

  socket.on("ask_pending_requests", async (user_id) => {
    try {
      try {
        // Find the friend model for the current user
        const friendModel = await FriendModel.findOne({ user: user_id });

        if (!friendModel) {
          // If the friend model for the current user doesn't exist, create and save a new one
          const newFriendModel = new FriendModel({
            user: user_id,
            friends: [],
            pending: [],
            blocked: [],
          });

          await newFriendModel.save();
          friendModel = newFriendModel;
        }
        const sentPendingRequests = await FriendModel.find(
          { pending: { $in: user_id } },
          { user: 1 }
        );

        if (
          !friendModel &&
          (!sentPendingRequests || sentPendingRequests.length === 0)
        ) {
          console.log("User has nothing");
          socket.emit("get_pending_requests", {
            success: false,
            message: "User has nothing",
          });
          return;
        }

        const pendingRequests = friendModel ? friendModel.pending : [];

        if (
          pendingRequests.length === 0 &&
          (!sentPendingRequests || sentPendingRequests.length === 0)
        ) {
          console.log("User has no pending requests");
          socket.emit("get_pending_requests", {
            success: false,
            message: "User has no pending requests",
          });
          return;
        }

        // itterate through senPendingRequests and find the corresponding user
        const sentUsers = [];
        for (const sentRequest of sentPendingRequests) {
          // UserModel find
          const user = await UserModel.findById(sentRequest.user, {
            username: 1,
            vorname: 1,
            _id: 1,
          });
          if (!user) {
            throw new Error(`User with ID ${sentRequest.user} not found`);
          }

          sentUsers.push(user);
        }

        const pendingUsers = await UserModel.find(
          { _id: { $in: pendingRequests } },
          { username: 1, vorname: 1, _id: 1 }
        );

        console.log("successPendingRequest");
        socket.emit("get_pending_requests", {
          success: true,
          pendingUsers,
          sentUsers,
        });
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("TypeError:", error.message);
          socket.emit("get_pending_requests", {
            success: false,
            message: "Error while getting pending requests",
          });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error(error);
      socket.emit("get_pending_requests", {
        success: false,
        message: "Error while getting pending requests",
      });
    }
  });

  socket.on("accept_request", async (friendId) => {
    console.log(friendId);
    try {
      // Find the friend model for the current user
      const friendModel = await FriendModel.findOne({ user: socket._id });
      if (!friendModel) {
        // user not found
        console.log("User not found");
        socket.emit("accept_request_response", {
          success: false,
          message: "User not found",
        });
      }
      // Find the friend model for the friend
      const friendModelFriend = await FriendModel.findOne({ user: friendId });
      if (!friendModelFriend) {
        // friend not found
        console.log("Friend not found");
        socket.emit("accept_request_response", {
          success: false,
          message: "Friend not found",
        });
        return;
      }

      // Check if the friend is in the pending array
      if (!friendModel.pending.includes(friendId)) {
        console.log("Friend is not in the pending array");
        socket.emit("accept_request_response", {
          success: false,
          message: "Friend is not in the pending array",
        });
        return;
      }

      // Remove the friend from the pending array
      const updatedFriend = await FriendModel.findOneAndUpdate(
        { user: socket._id },
        { $pull: { pending: friendId } }
      );
      if (!updatedFriend) {
        console.log("Error while removing friend from pending array");
        socket.emit("accept_request_response", {
          success: false,
          message: "Error while removing friend from pending array",
        });
        return;
      }

      // Add the friend to the friends array for both users if they are not already friends
      if (!friendModel.friends.includes(friendId)) {
        const updatedFriend = await FriendModel.findOneAndUpdate(
          { user: socket._id },
          { $push: { friends: friendId } }
        );
        if (!updatedFriend) {
          console.log("Error while adding friend to friends array");
          socket.emit("accept_request_response", {
            success: false,
            message: "Error while adding friend to friends array",
          });
          return;
        }
      }
      if (!friendModelFriend?.friends?.includes(socket._id)) {
        const updatedFriend = await FriendModel.findOneAndUpdate(
          { user: friendId },
          { $push: { friends: socket._id } }
        );
        if (!updatedFriend) {
          console.log("Error while adding friend to friends array");
          socket.emit("accept_request_response", {
            success: false,
            message: "Error while adding friend to friends array",
          });
          return;
        }
      }

      // find user with friendID and store his userID in variable
      friendSocketID = await UserModel.findOne(
        { _id: friendId },
        { userID: 1 }
      );
      console.log("FriendsID: " + friendSocketID);
      // Emit the success message
      console.log("successAcceptRequest");
      socket.emit("accept_request_response", {
        success: true,
        message: "Friend request accepted",
      });
      socket.emit("ask_friends");
      socket.to(friendSocketID.userID).emit("ask_friends");
    } catch (error) {
      console.error(error);
      socket.emit("accept_request_response", {
        success: false,
        message: "Error while accepting friend request",
      });
    }
  });

  socket.on("decline_request", async (friendId) => {
    try {
      // Find the friend model for the current user
      const friendModel = await FriendModel.findOne({ user: socket._id });
      if (!friendModel) {
        // user not found
        console.log("User not found");
        socket.emit("decline_request_response", {
          success: false,
          message: "User not found",
        });
      }

      // Check if the friend is in the pending array
      if (!friendModel.pending.includes(friendId)) {
        console.log("Friend is not in the pending array");
        socket.emit("decline_request_response", {
          success: false,
          message: "Friend is not in the pending array",
        });
        return;
      }

      // Remove the friend from the pending array
      const updatedFriend = await FriendModel.findOneAndUpdate(
        { user: socket._id },
        { $pull: { pending: friendId } }
      );
      if (!updatedFriend) {
        console.log("Error while removing friend from pending array");
        socket.emit("decline_request_response", {
          success: false,
          message: "Error while removing friend from pending array",
        });
        return;
      }

      // Emit the success message
      console.log("successDeclineRequest");
      socket.emit("decline_request_response", {
        success: true,
        message: "Friend request declined",
      });
      socket.emit("ask_friends");
    } catch (error) {
      console.error(error);
      socket.emit("decline_request_response", {
        success: false,
        message: "Error while declining friend request",
      });
    }
  });

  // socket to remove a friend request from the pending array
    socket.on("remove_request", async (friendId) => {
    try {
        // find the friendmodel with friendId
        const friend = await FriendModel.findOne({ user: friendId });
        if (!friend) {
        console.log("Friend not found");
        socket.emit("remove_request_response", {
            success: false,
            message: "Friend not found",
        });

        return;
        }

        // Check if the friend is in the pending array
        if (!friend.pending.includes(socket._id)) {
        console.log("Friend is not in the pending array");
        socket.emit("remove_request_response", {
            success: false,
            message: "Friend is not in the pending array",
        });
        return;
        }

        // Remove the friend from the pending array
        const updatedFriend = await FriendModel.findOneAndUpdate( { user: friendId }, { $pull: { pending: socket._id } });

        if (!updatedFriend) {
        console.log("Error while removing friend from pending array");
        socket.emit("remove_request_response", {
            success: false,
            message: "Error while removing friend from pending array",
        });

        return;
        }

        // Emit the success message
        console.log("successRemoveRequest");
        socket.emit("remove_request_response", {
        success: true,
        message: "Friend request removed",
        });
        socket.emit("ask_friends");

    } catch (error) {
        console.error(error);
        socket.emit("remove_request_response", {
        success: false,
        message: "Error while removing friend request",
        });
    }
    });


  socket.on("delete_friend", async (friendId) => {
    try {
      // Find the friend model for the current user
      const user = await FriendModel.findOne({ user: socket._id });
      const friend = await FriendModel.findOne({ user: friendId });

      if (!user || !friend) {
        console.log("User or friend not found");
        socket.emit("delete_friend_response", {
          success: false,
          message: "User or friend not found",
        });
        return;
      }

      // Remove the friend from the current user's friends array
      await FriendModel.updateOne(
        { user: socket._id },
        { $pull: { friends: friendId } }
      );

      // Remove the current user from the friend's friends array
      await FriendModel.updateOne(
        { user: friendId },
        { $pull: { friends: socket._id } }
      );

      // delete all messages between the two users
      await MessageModel.deleteMany({
        $or: [
          { sender: socket._id, receiver: friendId },
          { sender: friendId, receiver: socket._id },
        ],
      });

      console.log("Friendship deleted successfully");
      socket.emit("delete_friend_response", {
        success: true,
        message: "Friendship deleted successfully",
      });
    } catch (error) {
      console.error(error);
    }
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "API Test" });
});

http.listen(socketPort, () => {
  console.log(`SocketIO läuft auf http://localhost:${socketPort}`);
});
