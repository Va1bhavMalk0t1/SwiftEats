const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

// all routes require user
router.use(authMiddleware);

router.post("/add", cartController.addToCart);
router.get("/", cartController.getCart);
router.delete("/remove/:foodId", cartController.removeItem);
router.put("/update", cartController.updateQuantity);

module.exports = {
  cartRouter: router,
};