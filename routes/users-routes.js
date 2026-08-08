const express = require("express");

const usersControllers = require("../controllers/users-controllers");
// Import user controllers.
// Contains: getUsers / signup / login

const { check } = require("express-validator");
// Import validator function.

const router = express.Router();
// Create router.

router.get("/", usersControllers.getUsers);
// GET USERS
// Full URL: GET /api/users
// Because app.js has: app.use("/api/users", usersRoutes)
// and here: // router.get("/")

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup,
);
// SIGNUP
// Full URL: POST /api/users/signup
// Check name.
// Name cannot be empty.
// First normalize the email.
// Then check whether it is
// a valid email.
// Password must contain
// minimum 6 characters.
// Run signup controller.

router.post("/login", usersControllers.login);
// LOGIN
// Full route:
// POST /api/users/login

module.exports = router;
// Export router.
