const httpStatus = require("http-status");
const UserService = require("../services/UserService");
const { passwordToHash, generateJWTAccessToken, generateJWTRefreshToken, checkSecureFileProfile } = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const { uploadsUser } = require("../middlewares/FileUpload");
const fs = require("fs");

class UserController {
    
    create = (req, res) => {
        req.body.password = passwordToHash(req.body.password);
        UserService.create(req.body)
            .then((createdUser) => {
                if(!createdUser) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Not completed!" });
                res.status(httpStatus.OK).send(createdUser);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    list = (req, res) => {
        UserService.list()
            .then((userList) => {
                if(!userList) res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Not completed!" });
                res.status(httpStatus.OK).send(userList);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    login = (req, res) => {
        req.body.password = passwordToHash(req.body.password);
        UserService.findOne(req.body)
            .then((user) => {
                if(!user) return res.status(httpStatus.NOT_FOUND).send({ message: "User not found!"});
                user = {
                    ...user.toObject(),
                    tokens: {
                        access_token: generateJWTAccessToken(user),
                        refresh_token: generateJWTRefreshToken(user),
                    },
                }
                delete user.password;
                res.status(httpStatus.OK).send(user);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    update = (req, res) => {
        UserService.update(req.params.id, req.body)
            .then((updatedUser) => {
                if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: "Not found!"});
                res.status(httpStatus.OK).send(updatedUser);
            }) 
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    delete = (req, res) => {
        UserService.delete(req.params.id)
            .then((deleteUser) => {
                if(!deleteUser) return res.status(httpStatus.NOT_FOUND).send({ message: "Not found!"});
                res.status(httpStatus.OK).send(`Delete user with id: ${ req.params.id}, username: ${ deleteUser.user_name}`);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    findUser = (req, res) => {
        UserService.findOne({ _id: req.params.id })
            .then((user) => {
                if(!user) res.status(httpStatus.NOT_FOUND).send({ message: "User not found!"});
                res.status(httpStatus.OK).send(user);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    resetPassword = (req, res) => {
        const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
        console.log(new_password);
        UserService.updateWhere({email: req.body.email}, {password: passwordToHash(new_password)})
            .then((updatedUser) => {
                if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: "Not found!"});
                eventEmitter.emit("send-email", {
                    to: updatedUser.email,
                    subject: "Reset password",
                    html: `Your password has been reset according to your request. <br/>Don't forget to change your password after logging in! <br/>New password: <b>${new_password}<b>`, 
                });
                res.status(httpStatus.OK).send({ message:  "New password has been sent to your email." });
            })
            .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Error acquired while resetting the password." }));
    };

    addProfilePhoto = (req, res) => { 
       /*  if(!req.params.id) 
            return res.status(httpStatus.BAD_REQUEST).send({ message: "Missing information!"}); */ 
        UserService.findOne({ _id: req.params.id })
            .then((user) => {
                if(!user) res.status(httpStatus.NOT_FOUND).send({ message: "Not found!" }); 
                else {
                    uploadsUser(req, res, function(error) {
                        if(error) {
                            console.log(error);
                        }
                        else {
                            if(user.profile_photo) {
                                let deletePre = path.join(__dirname, "../", "uploads/users/" + user.profile_photo);
                                fs.unlink(deletePre, (error) => {
                                    if(error) console.log(error);
                                    console.log('Previous profile photo deleted');
                                });
                            }
                            user.profile_photo = req.file.filename;
                            UserService.update(req.params.id, user) 
                            .then((updatedUser) => {
                                if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ message: "Not found!"});
                                res.status(httpStatus.OK).send(updatedUser);
                            })
                            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
                        }
                    })
                }
            });
    }; 

    followSomeone = (req, res) => {
        UserService.findOne({ _id: req.params.id })
            .then((user) => {
                if(!user) res.status(httpStatus.NOT_FOUND).send({ message: "Not found!" });
                
                    UserService.findOne({ user_name: req.body.follow_user })
                        .then((followUser) => {
                            if(!followUser) res.status(httpStatus.NOT_FOUND).send({ message: "User not found!" });
                            const follow_user = {
                                ...req.body,
                                user_id: followUser._id
                            };
                            
                             const follower_user = {
                                follower_user:user.user_name,
                                user_id: req.params.id
                            }; 
                            let found = user.follow.some( account => account.follow_user === req.body.follow_user);
                            if(found) {
                                res.status(httpStatus.BAD_REQUEST).send({message: "Already following"});
                            }
                            else
                            {
                                user.follow.push(follow_user);
                                UserService.update(req.params.id, user)
                                    .then((updatedUser) => {
                                        res.status(httpStatus.OK).send(updatedUser);
                                    })
                                
                                followUser.followers.push(follower_user)
                                UserService.updateWhere({ user_name: req.body.follow_user }, followUser)
                                    .then((updatedUser) => {
                                        res.end(updatedUser);
                                    })
                            }
                        })
                
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };

    unfollowSomeone = (req, res) => {
        UserService.findOne({ _id: req.params.id })
            .then((user) => {
                if(!user) res.status(httpStatus.NOT_FOUND).send({ message: "Not found!" });
                
                    UserService.findOne({ user_name: req.body.follow_user })
                        .then((followUser) => {
                            if(!followUser) res.status(httpStatus.NOT_FOUND).send({ message: "User not found!" });
                             const follower_user = {
                                follower_user:user.user_name,
                                user_id: req.params.id
                            }; 
                            let found = user.follow.some( account => account.follow_user === req.body.follow_user);
                            if(found) {
                                user.follow = user.follow.filter(item => item.follow_user !== req.body.follow_user)
                                UserService.update(req.params.id, user)
                                    .then((updatedUser) => {
                                        res.status(httpStatus.OK).send(updatedUser);
                                    })
                                
                                followUser.followers = followUser.followers.filter(item => item.follower_user !== follower_user.follower_user)
                                UserService.updateWhere({ user_name: req.body.follow_user }, followUser)
                                    .then((updatedUser) => {
                                        res.end(updatedUser);
                                    })
                            }
                            else
                            {
                                res.status(httpStatus.BAD_REQUEST).send({message: "Not following"});
                            }
                        })
                
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };
    
    
}

module.exports = new UserController();
