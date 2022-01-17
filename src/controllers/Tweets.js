const httpStatus = require("http-status");
const TweetService = require("../services/TweetService");
const {uploadsTweet} = require("../middlewares/FileUpload");

class TweetController {
    create = (req, res) => {
        uploadsTweet(req, res, function(error) {
            if(error) {
                console.log(error);
            }
            else {
                req.body.user_created = req.user;
                TweetService.create(req.body)
                .then((tweet) => {
                    if(!tweet) res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Not completed!");
                    tweet.media = req.file.filename;
                    res.status(httpStatus.OK).send(tweet);
                })
                .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
            }
        })
    };

    list = (req, res) => {
        TweetService.list()
            .then((tweetList) => {
                if(!tweetList) res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Not completed!");
                res.status(httpStatus.OK).send(tweetList);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    delete = (req, res) => {
        TweetService.delete(req.params.id)
            .then((deleteTweet) => {
                if(!deleteTweet) res.status(httpStatus.NOT_FOUND).send({ message:"The tweet you're looking for doesn't exist!" });
                res.status(httpStatus.OK).send("Tweet deleted.");
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

}

module.exports = new TweetController();