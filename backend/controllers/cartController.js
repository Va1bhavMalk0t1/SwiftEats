const cartService = require('../services/cartService')
const { connection } = require('../config/db')

const runQuery = (sql, values = []) =>
  new Promise((resolve, reject) =>
    connection.query(sql, values, (err, results) => (err ? reject(err) : resolve(results)))
  )

// ➤ ADD TO CART  POST /cart/add
// body: { foodId, name, price, quantity }
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { foodId, name, price, quantity = 1 } = req.body

    if (!foodId || !name || !price) {
      return res.status(400).json({ success: false, message: 'foodId, name and price are required' })
    }

    const result = await cartService.addToCart(userId, { foodId, name, price, quantity })
    return res.status(200).json({ success: true, message: 'Item added to cart', data: result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ➤ GET CART  GET /cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id

    const cart = await runQuery('SELECT * FROM cart WHERE user_id = ?', [userId])
    if (!cart.length) {
      return res.status(200).json({ success: true, data: { items: [], total_price: 0 } })
    }

    const cartId = cart[0].id
    const items = await runQuery('SELECT * FROM cart_items WHERE cart_id = ?', [cartId])

    return res.status(200).json({
      success: true,
      data: { id: cartId, user_id: userId, total_price: cart[0].total_price, items },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ➤ REMOVE ITEM  DELETE /cart/remove/:foodId
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id
    const foodId = parseInt(req.params.foodId)

    if (isNaN(foodId)) {
      return res.status(400).json({ success: false, message: 'Invalid foodId' })
    }

    const cart = await runQuery('SELECT * FROM cart WHERE user_id = ?', [userId])
    if (!cart.length) return res.status(404).json({ success: false, message: 'Cart not found' })

    const cartId = cart[0].id
    const deleted = await runQuery(
      'DELETE FROM cart_items WHERE cart_id = ? AND food_id = ?',
      [cartId, foodId]
    )

    if (deleted.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not in cart' })
    }

    // Recalc total
    const remaining = await runQuery('SELECT price, quantity FROM cart_items WHERE cart_id = ?', [cartId])
    const total = remaining.reduce((sum, i) => sum + i.price * i.quantity, 0)
    await runQuery('UPDATE cart SET total_price = ? WHERE id = ?', [total, cartId])

    return res.status(200).json({ success: true, message: 'Item removed from cart' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ➤ UPDATE QUANTITY  PUT /cart/update
// body: { foodId, quantity }
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id
    const { foodId, quantity } = req.body

    if (!foodId || quantity == null || quantity < 0) {
      return res.status(400).json({ success: false, message: 'foodId and quantity are required' })
    }

    const cart = await runQuery('SELECT * FROM cart WHERE user_id = ?', [userId])
    if (!cart.length) return res.status(404).json({ success: false, message: 'Cart not found' })

    const cartId = cart[0].id

    if (quantity === 0) {
      await runQuery('DELETE FROM cart_items WHERE cart_id = ? AND food_id = ?', [cartId, foodId])
    } else {
      const updated = await runQuery(
        'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND food_id = ?',
        [quantity, cartId, foodId]
      )
      if (updated.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not in cart' })
      }
    }

    // Recalc total
    const remaining = await runQuery('SELECT price, quantity FROM cart_items WHERE cart_id = ?', [cartId])
    const total = remaining.reduce((sum, i) => sum + i.price * i.quantity, 0)
    await runQuery('UPDATE cart SET total_price = ? WHERE id = ?', [total, cartId])

    return res.status(200).json({ success: true, message: 'Quantity updated' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
