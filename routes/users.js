import express from "express";
import UserController from "../controllers/users.js";
import passport from "passport";
import upload from "../utils/multer.js";
var router = express.Router();

/* GET users listing. */
router.post("/login", UserController.login);
router.post("/add-user", UserController.addUser);
router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);
router.get("/get-profile", passport.authenticate("jwt", { session: false }), UserController.getUser);
router.patch(
  "/",
  [passport.authenticate("jwt", { session: false }), upload.single("image")],
  UserController.updateUser
);

export default router;
