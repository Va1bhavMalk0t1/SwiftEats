const { connection } = require("../config/db");

// helper to run query as promise
const runQuery = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// helper: recalc total
const recalcTotal = async (cartId) => {
  const items = await runQuery(
    "SELECT price, quantity FROM cart_items WHERE cart_id = ?",
    [cartId]
  );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  await runQuery(
    "UPDATE cart SET total_price = ? WHERE id = ?",
    [total, cartId]
  );
};

// ➤ ADD TO CART
exports.addToCart = async (userId, item) => {
  const { foodId, name, price, quantity } = item;

  let cart = await runQuery(
    "SELECT * FROM cart WHERE user_id = ?",
    [userId]
  );

  if (!cart.length) {
    const result = await runQuery(
      "INSERT INTO cart (user_id, total_price) VALUES (?, 0)",
      [userId]
    );
    cart = [{ id: result.insertId }];
  }

  const cartId = cart[0].id;

  const existing = await runQuery(
    "SELECT * FROM cart_items WHERE cart_id = ? AND food_id = ?",
    [cartId, foodId]
  );

  if (existing.length) {
    await runQuery(
      "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
      [quantity, existing[0].id]
    );
  } else {
    await runQuery(
      "INSERT INTO cart_items (cart_id, food_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)",
      [cartId, foodId, name, price, quantity]
    );
  }

  await recalcTotal(cartId);

  return { cartId };
};