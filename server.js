const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importér routes
const datesRoutes = require("./routes/dates");
const locationsRoutes = require("./routes/locations");
const eventsRoutes = require("./routes/events");

// Monter routes
app.use("/dates", datesRoutes);
app.use("/locations", locationsRoutes);
app.use("/events", eventsRoutes);

// Global fejlhåndtering
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, PATCH");
  console.error(err.stack);
  res.status(500).json({ message: "Noget gik galt!" });
});
app.get("/", function (req, res) {
  res.json({
    isMyServerLive: true,
    suggestions: "Try visiting /events or /locations",
  });
});

app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});
