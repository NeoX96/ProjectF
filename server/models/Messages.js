const mongoose = require("mongoose");
const User = require('./Users');

// MongoDB Message Tabelle
const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: User },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: User },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    username: {
        type: String,
        maxlength: 30
    }
});

const MessageModel = mongoose.model("messages", MessageSchema);
module.exports = MessageModel;
