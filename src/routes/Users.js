const express = require("express");
const Users = require("../controllers/Users");
const schemas = require("../validations/Users");
const Middlewares = require("../middlewares/Middlewares");

const router = express.Router();

router.route("/").post(Middlewares.validate(schemas.createUser, "body"), Users.create);
router.route("/").get(Users.list);

router.route("/login").post(Middlewares.validate(schemas.userLogin, "body"), Users.login);

router.route("/:id").patch(Middlewares.authenticateUser, Middlewares.validate(schemas.updateUser, "body"), Users.update);
router.route("/:id").delete(Middlewares.authenticateUser, Users.delete);
router.route("/:id/add-photo").post(Middlewares.authenticateUser, Users.addProfilePhoto);

router.route("/reset-password").post(Middlewares.validate(schemas.resetPassword, "body"), Users.resetPassword);

router.route("/:id/follow").post(Middlewares.validate(schemas.followUser, "body"), Users.followSomeone);

module.exports = router;
