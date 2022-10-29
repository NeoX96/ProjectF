const mongoose = require("mongoose");

// MongoDB Message Tabelle
const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        maxlength: 100
    },
    username: {
        type: String,
        required: true,
        maxlength: 30
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const MessageModel = mongoose.model("messages", MessageSchema);
module.exports = MessageModel;