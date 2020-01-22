const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

// Ticket

// CREATE
router.post("/tickets/book", async (req, res) => {
  try {
    const newTicket = new Ticket({
      eventId: req.fields.eventId,
      mail: req.fields.mail,
      username: req.fields.username,
      category: req.fields.category,
      seats: req.fields.seats
    });
    const position = req.fields.category;
    const event = await Event.findById(req.fields.eventId);
    const eventToUpdate = event.seats[position];
    const numberOfSeats = eventToUpdate - Number(req.fields.seats);
    if (
      (req.fields.category !== "mezzanine" &&
        req.fields.category !== "orchestre") ||
      Number(req.fields.seats) > 4 ||
      Number(req.fields.seats) < 0
    ) {
      res.json({ message: "Invalid request" });
    } else if (numberOfSeats >= 0) {
      await newTicket.save();
      event.seats[position] = numberOfSeats;
      await event.save();
    } else {
      res.json({ message: "Not enough available seats for this category" });
    }
    res.json({ message: `${req.fields.seats} seats successfully booked` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ
router.post("/tickets", async (req, res) => {
  try {
    console.log(req.fields.mail);
    const ticket = await Ticket.find({
      mail: req.fields.mail
    }).populate("eventId");
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
router.post("/ticket/annulate", async (req, res) => {
  try {
    const ticketToAnnulate = await Ticket.findOne({ mail: req.fields.mail });
    const position = ticketToAnnulate.category;
    const event = await Event.findById(ticketToAnnulate.eventId);
    const eventToUpdate = event.seats[position];
    console.log(eventToUpdate);
    numberOfSeats = eventToUpdate + ticketToAnnulate.seats;
    event.seats[position] = numberOfSeats;
    console.log(numberOfSeats);
    await event.save();
    await ticketToAnnulate.remove();
    res.json({ message: "ticket deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE

module.exports = router;
