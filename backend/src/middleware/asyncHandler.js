// Express 4 does not catch rejected promises from an async route handler —
// an unhandled rejection there can crash the whole process on a transient
// DB error. Wrap every async handler with this so failures reach the
// error-handling middleware in index.js instead.
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
