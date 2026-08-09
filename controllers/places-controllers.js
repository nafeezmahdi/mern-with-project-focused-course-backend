const { v4: uuid } = require("uuid");
// Import UUID for generating unique IDs.

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
// Import custom HttpError

const getCoordsForAddress = require("../util/location");
// Import our address-to-coordinate function.

const { validationResult } = require("express-validator");
// Import validation result.

const Place = require("../models/place");
const User = require("../models/user");
// const { default: mongoose } = require("mongoose");

let DUMMY_PLACES = [
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
// TEMPORARY PLACES DATABASE
// let is used instead of const because later
// deletePlace() assigns a NEW ARRAY
// back into DUMMY_PLACES.
// Location is another object
// nested inside the place object.
// This place belongs to user u1.

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not find a place.`,
      500,
    );
    return next(error);
  }

  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });

  if (!place) {
    const error = new HttpError("Could not find a place for provider id.", 404);
    next(error);

    // const error = new HttpError("Could not find a place for provider id.", 404);
    // error.code = 404;
    // throw error;
  }

  res.json({ place: place.toObject({ getters: true }) });

  // res.json({ place });

  //   console.log("GET Request in Places");
  // Log a message to the server's console or terminal
  //   res.json({ message: "It Works!!!" });
  // Send a JSON response back to the client/browser
};
// GET ONE PLACE BY ID
// URL: GET /api/places/p1
// Route: "/:pid"
// therefore:
// req.params.pid === "p1"
// Search DUMMY_PLACES.
// p represents each place.
// Keep searching until:
// p.id === placeId
// becomes true.
// If .find() couldn't find anything,
// place becomes undefined.
/* !place then becomes true. */
// Stop and throw 404 error.
// If place exists,
// send it back to frontend.

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      `Could not find places for the provider user id.`,
      404,
    );

    return next(error);
  }

  // const places = DUMMY_PLACES.filter((p) => {
  //   return p.creator === userId;
  // });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for provider user id.", 404),
    );

    // const error = new Error("Could not find a place for provider user id.");
    // error.code = 404;
    // return next(error);

    // return res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provider user id." });
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });

  // res.json({ places });
};
// GET ALL PLACES OF A USER
// Example:
// GET /api/places/user/u1
// req.params.uid
// becomes: "u1"
// filter() checks ALL places
// and returns ALL matches.
// We keep a place if:
// p.creator === userId
// Example:
// userId = "u1"
// Places:
// p1 creator u1 ✅
// p2 creator u2 ❌
// p3 creator u1 ✅
// Result:
// [p1, p3]
// If no places exist...
// Create error and send it
// to the next middleware.
// Otherwise send places.

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, Please check your data.", 422),
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01gn8_2ATgLRVElDgMZlRz66fFq5B9TsenBYLBkHNlNAD8jSFglZ05kU&s=10`,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provider id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    // await createdPlace.save();
  } catch (err) {
    const error = new HttpError(`Creating Place failed, please try again`, 500);
    return next(error);
  }

  // DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};
// CREATE PLACE
// async means this function can use await.
// Get validation result.
// If validation failed...
// REQUEST BODY
// Incoming data may look like:
// {
//   "title": "My Home",
//   "description": "A nice place",
//   "address": "Dhaka",
//   "creator": "u1"
// }
// Destructure properties from req.body.
// Declare coordinates.
// At this moment: coordinates === undefined
// GET COORDINATES
// Call our asynchronous location function.
// await means:
// "Wait for the result before continuing
// this function."
// If getCoordsForAddress throws/rejects,
// send error to Express error middleware.
// CREATE PLACE OBJECT
// Generate unique ID.
// coordinates might be:
// {
//   lat: 40.74,
//   lng: -73.98
// }
// SAVE
// Add place to array.
// RESPONSE
// 201 = Created

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, Please check your data.", 422),
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not update place.`,
      500,
    );

    return next(error);
  }

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not update place.`,
      500,
    );

    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
// UPDATE PLACE
// Get validator result.
// Validation failed.
// Get updated title and description
// from frontend.
// Get place ID from URL.
// PATCH /api/places/p1
// placeId = "p1"
// FIND PLACE AND COPY IT
// First:
// DUMMY_PLACES.find(...)
// gets the matching object.
// Then:
// {...object}
// creates a shallow copy using
// the spread operator.
// Example:
// Original:
// {
//   id: "p1",
//   title: "Old",
//   description: "Old description"
// }
//
// ... copies those properties
// into a new object.
// Find where the place exists
// inside the array.
// Example:
// [
//   p1, // index 0
//   p2, // index 1
//   p3  // index 2
// ]
// Looking for p2:
// placeIndex = 1
// Change copied object's title.
// Change copied object's description.
// Replace original place
// inside DUMMY_PLACES.
// Return updated object.

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not delete place`,
      500,
    );

    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    // await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not delete place`,
      500,
    );

    return next(error);
  }

  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find a place for that id.", 404);
  // }

  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};
// DELETE PLACE
// Get ID from URL.
// DELETE /api/places/p1
// First check whether place exists.
// Place does not exist.
// REMOVE PLACE
// filter() creates a NEW array.
// Keep every place whose ID
// is NOT the deleted ID.
// Example:
// Before:
// [
//   { id: "p1" },
//   { id: "p2" },
//   { id: "p3" }
// ]
// Delete p2:
// p.id !== "p2"
// Results:
// [
//   { id: "p1" },
//   { id: "p3" }
// ]
// Send success response.

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
// EXPORT CONTROLLERS
