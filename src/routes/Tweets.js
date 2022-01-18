const express = require("express");
const Tweets = require("../controllers/Tweets");
const schemas = require("../validations/Tweets");
const Middlewares = require("../middlewares/Middlewares");

const router = express.Router();

router.route("/").post(Middlewares.authenticateUser, Middlewares.validate(schemas.createTweet, "body"), Tweets.create);
router.route("/").get(Tweets.list);
 
module.exports = router;
