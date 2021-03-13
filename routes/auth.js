const passport = require("passport");
const Router = require("express").Router;
const router = Router();

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { successRedirect: "/" }),
);
router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
