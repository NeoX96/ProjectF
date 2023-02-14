const mongoose = require("mongoose");
const bcrypt = require('bcrypt');




// MongoDB User Tabelle
const UserSchema = new mongoose.Schema({
  vorname: {
    type: String,
    required: true,
    maxlength: 30
  },
  username: {
    type: String,
    required: true,
    maxlength: 30
  },
  birthday: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  online: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
// session ID für SocketIO
  sessionID: {
    type: String
  },
// User ID für SocketIO
  userID: {
    type: String
  }
});


const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;