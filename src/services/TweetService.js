const Tweet = require("../models/Tweet");
const BaseService = require("./BaseService");

class TweetService extends BaseService {
    constructor() {
        super(Tweet);
    };

    list() {
        return Tweet.find({})
            .populate({
                path: "user_created",
                select: "user_name first_name surname",
            })
    };
    
}

module.exports = new TweetService();