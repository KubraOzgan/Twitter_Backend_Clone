const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");


const storageTweet = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/tweets/"));
    },
    filename: function(req, file, cb) {
        const name = uuidv4();
        cb(null, file.fieldname + name +file.originalname);
    } 
});

const storageUser = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/users/"));
    },
    filename: function(req, file, cb) {
        const name = uuidv4();
        cb(null, file.fieldname + name +file.originalname);
    } 
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const uploadsTweet = multer({
    storage: storageTweet,
    fileFilter: fileFilter
}).single('media');

const uploadsUser = multer({
    storage: storageUser,
    fileFilter: fileFilter
}).single('profile_photo');

module.exports = {
    uploadsTweet,
    uploadsUser
};