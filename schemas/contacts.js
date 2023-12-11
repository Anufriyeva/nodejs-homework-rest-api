const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": `"name" is a required field` }),
  email: Joi.string().email().required().messages({ "any.required": `"email" is a required field` }),
  phone: Joi.string().required().messages({ "any.required": `"phone" is a required field` }),
  favorite: Joi.boolean(),
});

const updFavSchema = Joi.object({
  favorite: Joi.boolean().required().messages({ "any.required": `"favorite" is a required field` }),
});

module.exports = {
  addSchema,
  updFavSchema,
};