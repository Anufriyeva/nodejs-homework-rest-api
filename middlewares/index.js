const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const auth = require("./auth");
const upload = require("./multer");

module.exports = {
  validateBody,
  isValidId,
  auth,
  upload,
};