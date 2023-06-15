import express from "express";
import StripeController from "../controllers/stripe.js";
import passport from "passport";
var router = express.Router();

/* GET users listing. */
router.post("/connect-stripe", passport.authenticate("jwt", { session: false }), StripeController.connect);
router.get("/return", StripeController.returnAcc);

export default router;
