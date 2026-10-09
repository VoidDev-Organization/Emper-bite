import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { menuById } from '../data/menu';
import { cartReducer, sanitizeCart } from './cartReducer';
import { saveOrder } from '../utils/orders';

export const CART_KEY = 'ember-bite:cart:v1';
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return sanitizeCart(raw, new Set(menuById.keys()));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  // Persist cart on every change.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be full or blocked - the cart still works in memory */
    }
  }, [lines]);

  // Keep several open tabs in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== CART_KEY) return;
      try {
        const next = sanitizeCart(JSON.parse(e.newValue || '[]'), new Set(menuById.keys()));
        dispatch({ type: 'CLEAR' });
        next.forEach((l) => {
          for (let i = 0; i < l.qty; i += 1) dispatch({ type: 'ADD', id: l.id });
        });
      } catch {
        /* ignore malformed data */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = menuById.get(line.id);
          return product
            ? { ...product, qty: line.qty, lineTotal: product.priceCents * line.qty }
            : null;
        })
        .filter(Boolean),
    [lines],
  );

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotalCents = useMemo(() => items.reduce((n, i) => n + i.lineTotal, 0), [items]);

  const addItem = useCallback(
    (id) => {
      const product = menuById.get(id);
      if (!product) return;
      dispatch({ type: 'ADD', id });
      notify(`${product.name} added to cart`);
    },
    [notify],
  );
  const increase = useCallback((id) => dispatch({ type: 'INC', id }), []);
  const decrease = useCallback((id) => dispatch({ type: 'DEC', id }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);

  /** Called only after a valid demo order has been built. Saves it, then clears the cart. */
  const completeOrder = useCallback((order) => {
    saveOrder(order);
    dispatch({ type: 'CLEAR' });
    setDrawerOpen(false);
    setLastOrder(order);
  }, []);
  const dismissOrder = useCallback(() => setLastOrder(null), []);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotalCents,
      drawerOpen,
      lastOrder,
      toast,
      addItem,
      increase,
      decrease,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      completeOrder,
      dismissOrder,
    }),
    [
      items,
      count,
      subtotalCents,
      drawerOpen,
      lastOrder,
      toast,
      addItem,
      increase,
      decrease,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      completeOrder,
      dismissOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
