const express = require("express");
// Import Express again to access the Router module

const placeControllers = require("../controllers/places-controllers");
const { check } = require("express-validator");

const router = express.Router();
// Create a new router object using Express's built-in Router function

router.get("/:pid", placeControllers.getPlaceById);
// Define a GET route for the root path ("/")
// When a client sends a GET request to this specific path, the callback function executes

router.get("/user/:uid", placeControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeControllers.createPlace,
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControllers.updatePlace,
);

router.delete("/:pid", placeControllers.deletePlace);

module.exports = router;
// Export the router so it can be imported and used in the main application file (app.js)
