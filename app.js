const express = require("express");
// Import the Express framework to create and configure the server
const bodyParser = require("body-parser");
// Import body-parser to parse incoming request bodies (e.g., JSON data from clients)

const placesRoutes = require("./routes/places-route");
// Import our custom router file that handles place-related routes

const HttpError = require("./models/http-error");

const app = express();
// Initialize the Express application

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
// Register the placesRoutes as middleware
// Every incoming request will be passed through this router to see if it matches any routes

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
// Start the server and make it listen for incoming connections on port 5000
