import express from "express";
import UserController from "../controllers/users.js";
import passport from "passport";
var router = express.Router();

/* GET users listing. */
router.post("/login", UserController.login);
router.post("/add-user", UserController.addUser);
router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);
router.get("/get-profile", passport.authenticate("jwt", { session: false }), UserController.getUser);

export default router;
