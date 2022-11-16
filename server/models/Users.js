const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// MongoDB User Tabelle
const UserSchema = new mongoose.Schema({
  vorname: {
    type: String,
    required: true,
    maxlength: 30
  },
  nickname: {
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
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
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