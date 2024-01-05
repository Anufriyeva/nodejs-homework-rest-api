const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({ "any.required": `"email" is a required field` }),
    password: Joi.string().required().messages({ "any.required": `"password" is a required field` }),
    subscription: Joi.string(),
    token: Joi.string(),
});

const loginSchema = Joi.object({
    email: Joi.string().required().messages({ "any.required": `"email" is a required field` }),
    password: Joi.string().required().messages({ "any.required": `"password" is a required field` }),
});

const emailSchema = Joi.object({
    email: Joi.string().required().messages({"any.required": `"email" is a required field`, }),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailSchema,
};