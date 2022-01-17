const Mongoose = require("mongoose");

const TweetSchema = Mongoose.Schema(
    {
        text: String,
        media: String,
        user_created: {
            type: Mongoose.Types.ObjectId,
            ref: "user"
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model("tweet", TweetSchema);

/* User id ref
Text 280?
Media (image, gif or video)
Date / Hour
createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY") // "Sun, 3PM 17"
    }
    
Likes (ref User id) ? and number
Rt (ref User id) ? and number */