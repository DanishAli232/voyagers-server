import express from "express";
import StripeController from "../controllers/stripe.js";
import passport from "passport";
var router = express.Router();

/* GET users listing. */
router.get("/user-details", passport.authenticate("jwt", { session: false }), StripeController.getUser);
router.post("/connect-stripe", passport.authenticate("jwt", { session: false }), StripeController.connect);
router.post("/checkout", passport.authenticate("jwt", { session: false }), StripeController.checkout);
router.get("/return", StripeController.returnAcc);

export default router;
