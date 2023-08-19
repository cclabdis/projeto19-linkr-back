import joi from "joi";

export const editPostSchema = joi.object({
    description: joi.string().max(255),
    hashtagsList: joi.array()
});