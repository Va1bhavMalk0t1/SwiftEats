const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/create", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderDetails);

module.exports = {
  orderRouter: router,
};