const express = require("express");
const router = express.Router();
const controller = require("../controllers/ReservationController");

router.post("/createAll", controller.CreateAllReservation);
router.get("/reservations", controller.getCampReservation);
router.get("/clear", controller.clearCampReservation);
  
module.exports = router;