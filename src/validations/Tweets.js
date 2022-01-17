const Joi = require("joi");

const createTweet = Joi.object({
    text: Joi.string().max(280),
    media: Joi.string(),
});


/* Reply
const addComment = Joi.object({
  
  comment: Joi.string().min(2).default(""),
  rate: Joi.number().required().min(1).max(5),
}); */

module.exports = {
    createTweet,
};