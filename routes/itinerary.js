import express from "express";
import passport from "passport";
import Itinerary from "../controllers/itinerary.js";
import upload from "../utils/multer.js";
var router = express.Router();

/* GET users listing. */
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), upload.any()],
  Itinerary.addItinierary
);
router.get("/", Itinerary.getItineraries);
router.get(
  "/purchased",
  passport.authenticate("jwt", { session: false }),
  Itinerary.getPurchasedItineraries
);
router.get(
  "/sendEmail/:id",
  passport.authenticate("jwt", { session: false }),
  Itinerary.sendEmail
);
router.get(
  "/list/me",
  passport.authenticate("jwt", { session: false }),
  Itinerary.getMyItineraries
);
router.get(
  "/view/:itineraryId",
  passport.authenticate("jwt", { session: false }),
  Itinerary.getSingleItinerary
);
router.delete(
  "/:itinerary",
  passport.authenticate("jwt", { session: false }),
  Itinerary.deleteItinerary
);
router.patch(
  "/deleteDay",
  passport.authenticate("jwt", { session: false }),
  Itinerary.deleteDay
);
router.patch(
  "/:itineraryId",
  [passport.authenticate("jwt", { session: false }), upload.any()],
  Itinerary.updateItinerary
);
// router.post("/add-user", UserController.addUser);
// router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);

export default router;
