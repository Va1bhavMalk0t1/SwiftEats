const orderService = require("../services/orderService");

// Must exactly match the DB enum values
const VALID_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] ; 

// ➤ CREATE ORDER (user)
exports.createOrder = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    const result = await orderService.createOrder(req.user.id, address);

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ➤ GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ➤ GET SINGLE ORDER DETAILS
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fix: Removed stray console.log("STATUS RECEIVED:", req.body.status)
    // req.body is empty on GET requests — those logs were misleading noise
    const order = await orderService.getOrderDetails(orderId);

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ➤ ADMIN: GET ALL ORDERS
// TODO: Consider moving this and updateOrderStatus into adminController.js
//       since they are admin-only operations and that's where role management lives.
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ➤ ADMIN: UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log("🔥 BACKEND RECEIVED:", status); 
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    // Fix: Validate against allowed enum values before hitting the DB
    if (!VALID_STATUSES.includes(status.trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`
      });
    }

    await orderService.updateOrderStatus(orderId, status.trim());

    res.status(200).json({
      success: true,
      message: "Order status updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};