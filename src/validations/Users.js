/* first_name: String,
        surname: String,
        date_birth: String,
        email: String,
        password: String,
        user_name: String,
        bio: String,
        profile_image: String,
        follow: [{
            type: Mongoose.Types.ObjectId,
            ref: "user"
        }],
        followers: [{
            type: Mongoose.Types.ObjectId,
            ref: "user"
        }] */
const Joi = require("joi");

const createUser = Joi.object({
    first_name: Joi.string().required().min(2),
    surname: Joi.string().required().min(2),
    date_birth: Joi.string().required().min(8),
    email: Joi.string().email().required().min(8),
    password: Joi.string().required().min(8),
    user_name: Joi.string().required().min(2),
    bio: Joi.string().required().min(2),
    profile_photo: Joi.string(),
});

const updateUser = Joi.object({
    first_name: Joi.string().min(2),
    surname: Joi.string().min(2),
    date_birth: Joi.string().min(8),
    email: Joi.string().email().min(8),
    password: Joi.string().min(8),
    user_name: Joi.string().min(2),
    bio: Joi.string().min(2),
    profile_photo: Joi.string(),
    follow: Joi.array(),
    followers: Joi.array(),
});

const userLogin = Joi.object({
    email: Joi.string().email().required().min(8),
    password: Joi.string().required().min(8),
});

const resetPassword = Joi.object({
    email: Joi.string().email().required().min(8),
});

const deleteUser = Joi.object({
    email: Joi.string().email().required().min(8),
});

const followUser = Joi.object({
    follow_user: Joi.string().required(),
})

module.exports = {
    createUser,
    updateUser,
    userLogin,
    resetPassword,
    deleteUser,
    followUser
}
