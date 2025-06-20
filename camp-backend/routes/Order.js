const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');

router.post('/order', controller.createOrder);
router.get("/order/:userId", controller.getUserOrders);
router.get("/clearOrders", controller.clearAllOrders);
router.get("/", controller.getAllOrders);
router.post("/delete/:id", controller.deleteOrder);

module.exports = router;