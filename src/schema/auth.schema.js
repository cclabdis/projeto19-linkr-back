import joi from "joi";

export const signUpSchema = joi.object({
  username: joi.string().min(3).trim().required(),
  photo: joi.string().uri().trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(3).required(),
  // confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

export const signInSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().required(),
});
