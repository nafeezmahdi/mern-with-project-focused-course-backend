const express = require("express");
// Import Express.
// Express is a Node.js framework used to create a backend/server.

// const { check } = require("express-validator");

const bodyParser = require("body-parser");
// Import body-parser.
// It allows our server to understand JSON data sent from the frontend.

const placesRoutes = require("./routes/places-route");
// Import the places router.
// This file contains routes like:
// GET    /api/places/:pid
// POST   /api/places
// PATCH  /api/places/:pid
// DELETE /api/places/:pid

const usersRoutes = require("./routes/users-routes");
// Import the users router.
// This contains routes like:
// GET  /api/users
// POST /api/users/signup
// POST /api/users/login

const HttpError = require("./models/http-error");
// Import our custom error class.
// Instead of using only:
// new Error()
// we can create:
// new HttpError("Something went wrong", 404)

const app = express();
// Create the Express application.
// Think of app as our main server object.
// Later we can use:
// app.use()
// app.listen()
// app.get()
// app.post()

app.use(bodyParser.json());
// JSON PARSER MIDDLEWARE
// Tell Express:
// "Whenever JSON data comes from the frontend,
// convert it into a JavaScript object."
// Example frontend sends:
// {
//   "name": "John",
//   "email": "john@test.com"
// }
// Then we can use:
// req.body.name
// req.body.email

app.use("/api/places", placesRoutes);
// PLACES ROUTES
// Any request that starts with:
// /api/places
// will be forwarded to placesRoutes.
// Example:
// GET /api/places/p1
// Express first matches:
// /api/places
// then placesRoutes handles:
// /p1

app.use("/api/users", usersRoutes);
// USERS ROUTES
// Any request beginning with:
// /api/users
// is sent to usersRoutes.
// Example:
// POST /api/users/signup

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  // Create an HttpError object.
  // message: "Could not find this route"
  // error code: 404
  throw error;
  // Throw the error.
  // Express will send it to the
  // error-handling middleware below.
});
// UNKNOWN ROUTE / 404 MIDDLEWARE
// This middleware runs only if none of the routes above matched.
// Example:
// GET /api/banana
// Since no /api/banana route exists,
// Express reaches this middleware.

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  // Your original code has:
  // res.headerSent
  // The Express property is actually:
  // res.headersSent
  // It checks whether a response has already
  // been sent to the client.
  // If response was already sent,
  // pass the error to another Express error handler.
  res.status(error.code || 500);
  // Set response status.
  // If error.code exists:
  // use error.code
  // otherwise:
  // use 500
  // 500 = Internal Server Error
  res.json({ message: error.message || "An unknown error occurred!" });
  // Send JSON response to frontend.
  // If error.message exists, use it.
  // Otherwise use:
  // "An unknown error occurred!"
});
// GLOBAL ERROR HANDLER
// Notice this middleware has FOUR parameters:
// error
// req
// res
// next
// Express understands that a middleware with
// four parameters is an ERROR middleware.

app.listen(5000);
// Start the server and make it listen for incoming connections on port 5000
// START SERVER
// Start the backend on port 5000.
// Server address:
// http://localhost:5000
