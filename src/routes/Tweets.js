const express = require("express");
const Tweets = require("../controllers/Tweets");
const schemas = require("../validations/Tweets");
const Middlewares = require("../middlewares/Middlewares");
const { uploadsTweet } = require("../middlewares/FileUpload");

const router = express.Router();

router.route("/").post(Middlewares.authenticateUser, Middlewares.validate(schemas.createTweet, "body"), Tweets.create);
router.route("/").get(Tweets.list);

 router.route("/x").post((req,res,next) => {
    try {
        uploadsTweet(req, res, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                res.status(200).send(req.file)
            }
        })
    }
    catch(error) {
        console.log("Hata");
    }
}) 
module.exports = router;