// Friendlist model
const mongoose = require("mongoose");

// MongoDB Friendlist Tabelle mit User Referenz zwischen welchen Usern die Freundschaft besteht mit request tabelle und blocked tabelle
const FriendlistSchema = new mongoose.Schema({
    // User der freunde hat
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    friends: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            date: {
                type: Date,
                default: Date.now
            },
            messages: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "users"
                    },
                    message: {
                        type: String,
                        required: true
                    },
                    date: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            request: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "users"
                    }
                }
            ],
            blocked: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "users"
                    }
                }
            ]
        }
    ]
});

const FriendlistModel = mongoose.model("friendlist", FriendlistSchema);
module.exports = FriendlistModel;