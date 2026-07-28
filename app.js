const express = require("express");
// Import the Express framework to create and configure the server
const bodyParser = require("body-parser");
// Import body-parser to parse incoming request bodies (e.g., JSON data from clients)

const placesRoutes = require("./routes/places-route");
// Import our custom router file that handles place-related routes

const app = express();
// Initialize the Express application

app.use("/api/places", placesRoutes);
// Register the placesRoutes as middleware
// Every incoming request will be passed through this router to see if it matches any routes

app.listen(5000);
// Start the server and make it listen for incoming connections on port 5000
