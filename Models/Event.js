const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  name: String,
  date: String,
  seats: {
    orchestre: Number,
    mezzanine: Number
  }
});

module.exports = Event;
