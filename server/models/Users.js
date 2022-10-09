const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// MongoDB User Tabelle
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  age: {
    type: Number,
    maxlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8
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