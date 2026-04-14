const { connection } = require("../config/db");

const runQuery = (sql, values = []) =>
  new Promise((resolve, reject) =>
    connection.query(sql, values, (err, results) => (err ? reject(err) : resolve(results)))
  )

// ─── CREATE ORDER (clears cart) ───────────────────────────────────────────────
exports.createOrder = async (userId, address) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
      if (err) return reject(err)
      try {
        const cart = await runQuery("SELECT * FROM cart WHERE user_id = ?", [userId])
        if (!cart.length) throw new Error("Cart not found")
        const cartId = cart[0].id

        const items = await runQuery("SELECT * FROM cart_items WHERE cart_id = ?", [cartId])
        if (!items.length) throw new Error("Cart is empty")

        const total = cart[0].total_price

        const orderResult = await runQuery(
          "INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)",
          [userId, total, address]
        )
        const orderId = orderResult.insertId

        for (const item of items) {
          await runQuery(
            "INSERT INTO order_items (order_id, food_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)",
            [orderId, item.food_id, item.name, item.price, item.quantity]
          )
        }

        await runQuery("DELETE FROM cart_items WHERE cart_id = ?", [cartId])
        await runQuery("UPDATE cart SET total_price = 0 WHERE id = ?", [cartId])

        connection.commit((err) => {
          if (err) return reject(err)
          resolve({ orderId })
        })
      } catch (err) {
        connection.rollback(() => reject(err))
      }
    })
  })
}

// ─── GET ALL ORDERS FOR A USER ────────────────────────────────────────────────
exports.getUserOrders = async (userId) => {
  const orders = await runQuery(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  )
  // Attach items to each order
  for (const order of orders) {
    order.items = await runQuery(
      "SELECT * FROM order_items WHERE order_id = ?",
      [order.id]
    )
  }
  return orders
}

// ─── GET SINGLE ORDER DETAILS ─────────────────────────────────────────────────
exports.getOrderDetails = async (orderId) => {
  const orders = await runQuery("SELECT * FROM orders WHERE id = ?", [orderId])
  if (!orders.length) throw new Error("Order not found")
  const order = orders[0]
  order.items = await runQuery("SELECT * FROM order_items WHERE order_id = ?", [orderId])
  return order
}

// ─── GET ALL ORDERS (admin) ───────────────────────────────────────────────────
exports.getAllOrders = async () => {
  const orders = await runQuery("SELECT * FROM orders ORDER BY created_at DESC")
  for (const order of orders) {
    order.items = await runQuery("SELECT * FROM order_items WHERE order_id = ?", [order.id])
  }
  return orders
}

// ─── UPDATE ORDER STATUS (admin) ─────────────────────────────────────────────
exports.updateOrderStatus = async (orderId, status) => {
  const VALID = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];
  if (!VALID.includes(status)) throw new Error(`Invalid status. Must be one of: ${VALID.join(', ')}`)
  const result = await runQuery("UPDATE orders SET status = ? WHERE id = ?", [status, orderId])
  if (result.affectedRows === 0) throw new Error("Order not found")
}
