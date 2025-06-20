const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");

router.post('/guest-login', controller.handleGuestLogin);
router.post('/google-login', controller.handleGoogleLogin);

module.exports = router;