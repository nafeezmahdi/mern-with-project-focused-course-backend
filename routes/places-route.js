const express = require("express");
// Import Express again to access the Router module

const router = express.Router();
// Create a new router object using Express's built-in Router function

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  res.json({ place });

  //   console.log("GET Request in Places");
  // Log a message to the server's console or terminal
  //   res.json({ message: "It Works!!!" });
  // Send a JSON response back to the client/browser
});
// Define a GET route for the root path ("/")
// When a client sends a GET request to this specific path, the callback function executes

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  res.json({ place });
});

module.exports = router;
// Export the router so it can be imported and used in the main application file (app.js)
