const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
//Event

// CREATE
router.post("/events/create", async (req, res) => {
  try {
    const newEvent = new Event({
      name: req.fields.name,
      date: req.fields.date,
      seats: {
        orchestre: req.fields.seats.orchestre,
        mezzanine: req.fields.seats.mezzanine
      }
    });
    await newEvent.save();
    res.json({ message: "Event successfully created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ

router.get("/events/availabilities", async (req, res) => {
  try {
    const dateSearched = req.query.date;
    const event = await Event.find({ date: dateSearched });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/events/:_id", async (req, res) => {
  try {
    const idSearched = req.params._id;
    const eventSearched = await Event.findById(idSearched);
    res.json(eventSearched);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
router.post("/events/update", async (req, res) => {
  try {
    if (req.fields.name && req.fields.date) {
      const eventToUpdate = await Event.findOne({ name: req.fields.name });
      eventToUpdate.date = req.fields.date;
      await eventToUpdate.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.post("/events/delete", async (req, res) => {
  try {
    const eventToDelete = await Event.findOne({ name: req.fields.name });
    console.log(eventToDelete._id);
    const id = eventToDelete._id;
    const ticketToDelete = await Ticket.find({ eventId: id });
    ticketToDelete.forEach(ticket => {
      ticket.remove();
    });
    await eventToDelete.remove();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
