var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
