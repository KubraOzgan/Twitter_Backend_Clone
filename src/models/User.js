const Mongoose = require("mongoose");

const UserSchema = Mongoose.Schema (
    {
        first_name: String,
        surname: String,
        date_birth: String,
        email: {
            type: String,
            unique: true,
            uniqueCaseInsensitive: true,
            required: true,
        },
        password: String,
        user_name: {
            type: String,
            unique: true,
            uniqueCaseInsensitive: true,
            required: true,
        },
        bio: String,
        profile_photo: String,
        follow: [{
            follow_user: String,
            user_id: {
                type: Mongoose.Types.ObjectId,
                ref: "user"
            }
        }],
        followers: [{
            follower_user: String,
            user_id: {
                type: Mongoose.Types.ObjectId,
                ref: "user"
            }
        }]
    },
    { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model("user", UserSchema);

/* User name UNIQ!!!!!
Post(Schema)
*Account type     gender: {type: String, enum: ["Male", "Female"]}
Follow(ref User id) and follow number
Followers(ref User id) and number
Liked posts(ref Post id) and number
Rt posts(ref Post id) and number
Answered posts REPLY???? 
FIND OTHER USERS */