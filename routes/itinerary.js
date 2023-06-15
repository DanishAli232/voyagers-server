import express from "express";
import UserController from "../controllers/users.js";
import passport from "passport";
import Itinerary from "../controllers/itinerary.js";
var router = express.Router();

/* GET users listing. */
router.post("/", passport.authenticate("jwt", { session: false }), Itinerary.addItinierary);
router.get("/", passport.authenticate("jwt", { session: false }), Itinerary.getItineraries);
router.get("/view/:itineraryId", passport.authenticate("jwt", { session: false }), Itinerary.getSingleItinerary);
// router.post("/add-user", UserController.addUser);
// router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);

export default router;
