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
    minlength: 8
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

// Passwort Verschlüsselung mit bycript
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;