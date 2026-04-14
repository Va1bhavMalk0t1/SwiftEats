const express = require('express');
const router = express.Router();

const { adminMakerController, ownerMakerController } = require('../controllers/adminController');
const orderController = require('../controllers/orderController');

const { adminMiddleware } = require('../middleware/adminMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

// apply middleware once (cleaner)
router.use(authMiddleware);
router.use(adminMiddleware);


// 👤 USER ROLE MANAGEMENT
router.put('/make-admin/:id', adminMakerController);
router.put('/make-owner/:id', ownerMakerController);


// 📦 ORDER MANAGEMENT (ADMIN)
router.get('/orders', orderController.getAllOrders);
router.get('/order/:orderId', orderController.getOrderDetails);
router.put('/order/:orderId', orderController.updateOrderStatus);


module.exports = {
    adminRouter: router
};