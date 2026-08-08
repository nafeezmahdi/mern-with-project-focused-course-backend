const express = require("express");
// Import Express again to access the Router module

const placeControllers = require("../controllers/places-controllers");
// Import all place controller functions.
// placeControllers will be an object containing: getPlaceById / getPlacesByUserId / createPlace / updatePlace / deletePlace
const { check } = require("express-validator");
// Import check() from express-validator.
// check() allows us to validate request data.

const router = express.Router();
// Create an Express Router.
// A Router is like a mini Express app
// containing a group of related routes.

router.get("/:pid", placeControllers.getPlaceById);
// GET ONE PLACE
// :pid is a ROUTE PARAMETER.
// Example URL: /api/places/p1
// Here:
// pid = "p1"
// So inside controller: req.params.pid
// gives: "p1"
// When this route matches,
// execute getPlaceById().

router.get("/user/:uid", placeControllers.getPlacesByUserId);
// GET PLACES OF ONE USER
// Example:
// GET /api/places/user/u1
// :uid becomes: "u1"
// So: req.params.uid === "u1"

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeControllers.createPlace,
);
// CREATE NEW PLACE
// POST means:
// Create new data.
// Full route: POST /api/places
// "/" means root of this router.
// Because app.js already has:
// app.use("/api/places", placesRoutes)
// "/" becomes: /api/places
// Validate title.
// title cannot be empty
// Validate description.
// Description must contain
// minimum 5 characters.
// Validate address.
// Address cannot be empty.
// After validators finish,
// execute createPlace().

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControllers.updatePlace,
);
// UPDATE PLACE
// PATCH is normally used to update existing data.
// Example: PATCH /api/places/p1
// title cannot be empty
// description must contain
// at least 5 characters
// Execute update controller.

router.delete("/:pid", placeControllers.deletePlace);
// DELETE PLACE
// DELETE:
// DELETE /api/places/p1
// deletes place p1.

module.exports = router;
// Export router.
// This makes it possible to import it in app.js:
// require("./routes/places-route")
