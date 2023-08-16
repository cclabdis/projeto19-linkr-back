import joi from "joi"

export const postSchema = joi.object({
  description: joi.string().max(255),
  link: joi.string().required().uri()
})