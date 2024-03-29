const mongoose = require("mongoose");
const User = require('./Users');



// MongoDB Events Tabelle
const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User},

  name: {
    type: String,
    required: true,
    maxlength: 200
  },

uhrzeit: {
    type: Date,
    maxlength: 30,
    required: true,
},
lat: {
    type: Number,
    maxlength: 30
},
lng: {
    type: Number,
    maxlength: 30
},
equipment: {
    type: Boolean,
    default: false
},

index: {
    type: Number,
    maxlength: 30

},


teilnehmer: [{ type: mongoose.Schema.Types.ObjectId, ref: User }]
});


const EventModel = mongoose.model("events", EventSchema);
module.exports = EventModel;