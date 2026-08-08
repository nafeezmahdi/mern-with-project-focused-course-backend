class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}
// Create our own error class.
// "extends Error" means:
// HttpError inherits features
// from JavaScript's built-in Error class.
// constructor runs when we do:
// new HttpError(...)
// super(message)
// calls the constructor of the parent class:
// Error
// and stores the error message.
// Add our own property called code.
// Example:
// new HttpError("Not found", 404)
// becomes approximately:
// {
//   message: "Not found",
//   code: 404
// }

module.exports = HttpError;
// Export HttpError class.
