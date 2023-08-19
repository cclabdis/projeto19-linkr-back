import joi from "joi";

export const editPostSchema = joi.object({
    description: joi.string().max(255).allow('').required(),
    hashtagsList: joi.array().items(joi.string()).required()
});