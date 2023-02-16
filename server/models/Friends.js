// Friends.js
const mongoose = require("mongoose");
const User = require('./Users');

const FriendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  pending: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
});

const FriendModel = mongoose.model("friends", FriendSchema);
module.exports = FriendModel;
