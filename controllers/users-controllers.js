const HttpError = require("../models/http-error");
const User = require("../models/user");

const { validationResult } = require("express-validator");

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

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);

    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

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

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
