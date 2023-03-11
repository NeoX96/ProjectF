const mongoose = require("mongoose");
const User = require('./Users');

// MongoDB Teilnehmer Tabelle
const TeilnehmerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User},

  anzahl: {
    min: 0,
    max: 30
  },

  vorname: {
    type: String,
    maxlength: 30,
  },

});


const TeilnehmerModel = mongoose.model("teilnehmer", TeilnehmerSchema);
module.exports = TeilnehmerModel;