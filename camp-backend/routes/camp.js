const express = require("express");
const router = express.Router();
const controller = require("../controllers/CampController");

router.get("/", controller.getAllCamps);
router.post("/", controller.createCamp);
router.post("/update", controller.updateCamp);
router.get("/camps", controller.apiGetAllCamps);
router.get("/camps/:id", controller.getCampById);

module.exports = router;