const orderService = require("../services/orderService");

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

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    await orderService.updateOrderStatus(orderId, status);

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