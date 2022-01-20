const express = require("express");
const loaders = require("./loaders");
const config = require("./config");
const { UserRoutes, TweetRoutes } = require("./routes");
const events = require("./scripts/events");
const path = require("path");

config();
loaders();
events();

const app = express();
app.use(express.json());
<<<<<<< HEAD
=======

app.use("/user-images", express.static(path.join(__dirname, "./", "uploads/users")));
app.use("/tweet-images", express.static(path.join(__dirname, "./", "uploads/tweets"))); 
>>>>>>> refs/remotes/origin/main

app.listen(process.env.APP_PORT, () => {
    console.log(`Application is running on ${process.env.APP_PORT}`);
    app.use("/users", UserRoutes);
    app.use("/tweets", TweetRoutes);
});

