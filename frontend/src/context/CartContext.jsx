import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [items, setItems] = useState([])      // [{ id (food_id), name, price, qty }]
  const [syncing, setSyncing] = useState(false)

  // ─── Load cart from server on login ──────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setItems([])
      return
    }
    cartAPI.get()
      .then((res) => {
        const serverItems = res.data?.data?.items ?? []
        setItems(serverItems.map((i) => ({
          id: i.food_id,
          name: i.name,
          price: Number(i.price),
          qty: i.quantity,
        })))
      })
      .catch(() => setItems([]))
  }, [isLoggedIn])

  // ─── Add item (POST /cart/add) ────────────────────────────────────────────
  const addItem = useCallback(async (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), qty: 1 }]
    })
    try {
      setSyncing(true)
      await cartAPI.add({ foodId: item.id, name: item.name, price: Number(item.price), quantity: 1 })
    } catch {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id)
        if (!existing) return prev
        if (existing.qty === 1) return prev.filter((i) => i.id !== item.id)
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty - 1 } : i)
      })
    } finally {
      setSyncing(false)
    }
  }, [])

  // ─── Decrement or remove (PUT /cart/update or DELETE /cart/remove/:foodId) ─
  const removeItem = useCallback(async (foodId) => {
    const prev = items.find((i) => i.id === foodId)
    if (!prev) return
    if (prev.qty > 1) {
      setItems((p) => p.map((i) => i.id === foodId ? { ...i, qty: i.qty - 1 } : i))
      try {
        setSyncing(true)
        await cartAPI.update({ foodId, quantity: prev.qty - 1 })
      } catch {
        setItems((p) => p.map((i) => i.id === foodId ? { ...i, qty: prev.qty } : i))
      } finally { setSyncing(false) }
    } else {
      setItems((p) => p.filter((i) => i.id !== foodId))
      try {
        setSyncing(true)
        await cartAPI.remove(foodId)
      } catch {
        setItems((p) => [...p, prev])
      } finally { setSyncing(false) }
    }
  }, [items])

  // ─── Delete whole line (DELETE /cart/remove/:foodId) ─────────────────────
  const deleteItem = useCallback(async (foodId) => {
    const prev = items.find((i) => i.id === foodId)
    setItems((p) => p.filter((i) => i.id !== foodId))
    try {
      setSyncing(true)
      await cartAPI.remove(foodId)
    } catch {
      if (prev) setItems((p) => [...p, prev])
    } finally { setSyncing(false) }
  }, [items])

  // ─── Clear locally (server already cleared on order create) ──────────────
  const clearCart = useCallback(() => setItems([]), [])

  const { totalPrice, totalCount } = useMemo(() => ({
    totalPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    totalCount: items.reduce((sum, i) => sum + i.qty, 0),
  }), [items])

  const getItemQty = useCallback((id) => items.find((i) => i.id === id)?.qty ?? 0, [items])

  return (
    <CartContext.Provider value={{ items, syncing, addItem, removeItem, deleteItem, clearCart, totalPrice, totalCount, getItemQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
