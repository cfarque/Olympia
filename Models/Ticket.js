const mongoose = require("mongoose");

const Ticket = mongoose.model("Ticket", {
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  mail: String,
  username: String,
  category: String,
  seats: Number
});

module.exports = Ticket;
