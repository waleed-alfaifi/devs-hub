const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", controller.index);
router.get("/profile", isAuthenticated, controller.profile);

module.exports = router;
