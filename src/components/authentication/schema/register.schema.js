import Joi from "joi";

export const registerValidation = Joi.object({
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.base": "Fullname must be a string",
    "string.empty": "Fullname is required",
    "string.min": "Fullname must be at least 3 characters",
    "string.max": "Fullname must be less than or equal to 50 characters",
    "any.required": "Fullname is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  contact_no: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.base": "Contact number must be a string",
      "string.empty": "Contact number is required",
      "string.pattern.base": "Contact number must contain only digits",
      "any.required": "Contact number is required",
    }),

  role: Joi.string().optional().messages({
    "string.base": "Role must be a string",
  }),

  is_verified: Joi.number().default(0).messages({
    "number.base": "Is verified must be a number",
  }),

  meta: Joi.array()
    .items(
      Joi.object({
        meta_key: Joi.string().required().messages({
          "string.base": "Meta key must be a string",
          "string.empty": "Meta key is required",
          "any.required": "Meta key is required",
        }),
        meta_value: Joi.string().required().messages({
          "string.base": "Meta value must be a string",
          "string.empty": "Meta value is required",
          "any.required": "Meta value is required",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Meta must be an array of key-value pairs",
    }),
});
