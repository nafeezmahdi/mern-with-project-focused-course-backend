const { v4: uuid } = require("uuid");
// Import uuid.
// UUID generates unique IDs.
// v4 is renamed to uuid.
// So instead of: // v4()
// we can write: // uuid()

const HttpError = require("../models/http-error");
// Import our custom error class.
const User = require("../models/user");

const { validationResult } = require("express-validator");
// Import validationResult.
// The routes use check().
// The controller uses validationResult()
// to read the result of those checks.

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Nafeez Mahdi",
    email: "test@test.com",
    password: "testers",
  },
];
// TEMPORARY USER DATA
// This array acts like a fake database.
// You are not using MongoDB yet.
// Important:
// If the Node server restarts,
// new users added to this array disappear.

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500,
    );

    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });

  // res.json({ users: DUMMY_USERS });
};
// GET ALL USERS
// Send JSON response.
// The frontend receives something like:
// {
//   "users": [
//      {...}
//   ]
// }

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data.", 422),
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500,
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already. please login instead.",
      422,
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01gn8_2ATgLRVElDgMZlRz66fFq5B9TsenBYLBkHNlNAD8jSFglZ05kU&s=10",
    password,
    places: [],
  });

  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("Could not create user, email already exits.", 422);
  // }

  // const createdUser = {
  //   id: uuid(),
  //   name,
  //   email,
  //   password,
  // };

  // DUMMY_USERS.push(createdUser);

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);

    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
// SIGNUP
// Read validation errors
// created by check() in users-routes.js.
// errors.isEmpty()
// returns true if there are NO errors.
/*  !errors.isEmpty() */
// means:
// "There ARE validation errors."
// Stop execution and throw error.
// 422 means submitted data
// could not be processed.
// READ REQUEST BODY
// Frontend might send:
// {
//   "name": "John",
//   "email": "john@test.com",
//   "password": "123456"
// }
// bodyParser.json() turns that JSON
// into req.body.
// Here we use OBJECT DESTRUCTURING.
// This is equivalent to:
// const name = req.body.name;
// const email = req.body.email;
// const password = req.body.password;
// CHECK DUPLICATE USER
// .find() searches through DUMMY_USERS.
// u represents each user one by one.
// If:
// u.email === email
// is true,
// .find() returns that user
// If a user was found...
// Stop signup.
// CREATE USER
// Generate a new unique ID.
// JavaScript object shorthand.
// name
// means:
// name: name
// email: email
// password: password
// SAVE USER
// Add createdUser to
// the DUMMY_USERS array.
// RESPONSE
// 201 = Resource successfully created.

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      500,
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      `Invalid credentials, could not log you in`,
      401,
    );
    return next(error);
  }

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError(
  //     "Could not identify user, credentials seem to be wrong.",
  //     401,
  //   );
  // }

  res.json({ message: "Logged In" });
};
// LOGIN
// Extract email and password
// from incoming request body.
// Search for user whose email
// matches submitted email.
// There are TWO possible errors here.
// 1.
/* !identifiedUser */
// User does not exist.
// 2.
// identifiedUser.password !== password
// User exists but password is wrong.
// || means OR
// 401 = Unauthorized
// If code reaches here:
// user exists
// AND
// password is correct.

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
// EXPORT FUNCTIONS
// Make getUsers available
// to users-routes.js.
// Make signup available
// to users-routes.js.
// Make login available.
