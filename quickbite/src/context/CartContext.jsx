import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])    // [{ id, name, price, qty, restaurant_id, image_url }]

  // ─── Add item (or increment qty) ─────────────────────────────────────────
  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }, [])

  // ─── Remove item (or decrement qty) ──────────────────────────────────────
  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter((i) => i.id !== id)
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }, [])

  // ─── Remove entire item line ──────────────────────────────────────────────
  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  // ─── Clear cart ───────────────────────────────────────────────────────────
  const clearCart = useCallback(() => setItems([]), [])

  // ─── Derived values ───────────────────────────────────────────────────────
  const { totalPrice, totalCount } = useMemo(() => ({
    totalPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    totalCount: items.reduce((sum, i) => sum + i.qty, 0),
  }), [items])

  const getItemQty = useCallback((id) => {
    return items.find((i) => i.id === id)?.qty ?? 0
  }, [items])

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      deleteItem,
      clearCart,
      totalPrice,
      totalCount,
      getItemQty,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
