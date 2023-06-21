import express from "express";
import UserController from "../controllers/users.js";
import passport from "passport";
import Itinerary from "../controllers/itinerary.js";
import upload from "../utils/multer.js";
var router = express.Router();

/* GET users listing. */
router.post("/", [passport.authenticate("jwt", { session: false }), upload.any()], Itinerary.addItinierary);
router.get("/", Itinerary.getItineraries);
router.get("/view/:itineraryId", passport.authenticate("jwt", { session: false }), Itinerary.getSingleItinerary);
router.patch("/deleteDay", passport.authenticate("jwt", { session: false }), Itinerary.deleteDay);
router.patch(
  "/:itineraryId",
  [passport.authenticate("jwt", { session: false }), upload.any()],
  Itinerary.updateItinerary
);
// router.post("/add-user", UserController.addUser);
// router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);

export default router;
