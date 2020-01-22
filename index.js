const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());

mongoose.connect("mongodb://localhost/olympia", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const eventRoutes = require("./routes/event");
app.use(eventRoutes);
const ticketRoutes = require("./routes/ticket");
app.use(ticketRoutes);

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server Started");
});
