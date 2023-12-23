const statusMessage = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  409: "Conflict",
};

const HttpError = (status, message = statusMessage[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;