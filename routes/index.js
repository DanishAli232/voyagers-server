import express from "express";
import passport from "passport";
var router = express.Router();

/* GET home page. */
router.get("/", passport.authenticate("jwt", { session: false }), function (req, res, next) {
  res.send({ title: "Express" });
});

export default router;
