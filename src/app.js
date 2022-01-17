const express = require("express");
const loaders = require("./loaders");
const config = require("./config");
const { UserRoutes, TweetRoutes } = require("./routes");
const events = require("./scripts/events");
//const fileUpload = require('express-fileupload')
const path = require("path");

config();
loaders();
events();

const app = express();
app.use(express.json());
//app.use(fileUpload());

//Dinamik olarak eklenmis statik bir dosya oldugu icin dısari sunmaliyiz. 
//localhost urlsinde uploads gelirse bu dosyayi disariya static olarak sun!!!
//localhost:3000/user-images/dosyaAdi.uzanti
app.use("/user-images", express.static(path.join(__dirname, "./", "uploads/users")));
app.use("/tweet-images", express.static(path.join(__dirname, "./", "uploads/tweets")));

app.listen(process.env.APP_PORT, () => {
    console.log(`Application is running on ${process.env.APP_PORT}`);
    app.use("/users", UserRoutes);
    app.use("/tweets", TweetRoutes);

    /* app.post("/yeter", (req,res,next) => {
        try {
            tweetMedia(req, res, function(err) {
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
    }) */

});

