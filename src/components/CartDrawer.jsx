import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js';
import { formatMoney } from '../utils/pricing';
import FoodImage from './FoodImage.jsx';
import PriceSummary from './PriceSummary.jsx';
import CheckoutForm from './CheckoutForm.jsx';

function CartPanel() {
  const { items, count, subtotalCents, closeCart, increase, decrease, removeItem, clearCart } =
    useCart();
  const panelRef = useRef(null);
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [mode, setMode] = useState('delivery');

  useFocusTrap(panelRef, closeCart);
  useBodyScrollLock();

  const isEmpty = items.length === 0;

  return (
    <>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        aria-hidden="true"
      />
      <motion.aside
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="drawer-head">
          {step === 'checkout' ? (
            <button type="button" className="icon-btn" onClick={() => setStep('cart')} aria-label="Back to cart">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          ) : null}
          <h2 id="drawer-title" className="drawer-title">
            {step === 'checkout' ? 'Checkout' : `Your cart (${count})`}
          </h2>
          <button type="button" className="icon-btn drawer-close" onClick={closeCart} aria-label="Close cart">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {step === 'cart' && isEmpty && (
          <div className="drawer-empty">
            <span className="drawer-empty-icon">
              <ShoppingBag size={34} aria-hidden="true" />
            </span>
            <h3>Your cart is empty</h3>
            <p>Add a burger or a side from the menu and it will show up here.</p>
            <Link to="/order" className="btn btn-primary" onClick={closeCart}>
              Browse the menu
            </Link>
          </div>
        )}

        {step === 'cart' && !isEmpty && (
          <>
            <div className="drawer-scroll">
              <ul className="cart-lines">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      className="cart-line"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <FoodImage
                        className="cart-thumb"
                        src={item.image}
                        alt=""
                        category={item.category}
                        width={96}
                        height={96}
                      />
                      <div className="cart-line-main">
                        <p className="cart-line-name">{item.name}</p>
                        <p className="cart-line-unit">{formatMoney(item.priceCents)} each</p>
                        <div className="qty" role="group" aria-label={`Quantity for ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => decrease(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus size={15} aria-hidden="true" />
                          </button>
                          <motion.span
                            key={item.qty}
                            className="qty-value"
                            initial={{ scale: 1.35 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.18 }}
                            aria-live="polite"
                          >
                            {item.qty}
                          </motion.span>
                          <button
                            type="button"
                            onClick={() => increase(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-side">
                        <p className="cart-line-total">{formatMoney(item.lineTotal)}</p>
                        <button
                          type="button"
                          className="icon-btn icon-btn-small"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <button type="button" className="link-btn" onClick={clearCart}>
                Clear cart
              </button>
            </div>

            <footer className="drawer-foot">
              <PriceSummary subtotalCents={subtotalCents} mode={mode} estimate />
              <motion.button
                type="button"
                className="btn btn-primary btn-block"
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('checkout')}
              >
                Go to checkout
              </motion.button>
            </footer>
          </>
        )}

        {step === 'checkout' && (
          <CheckoutForm
            items={items}
            subtotalCents={subtotalCents}
            mode={mode}
            setMode={setMode}
            onBackToMenu={() => {
              setStep('cart');
              closeCart();
            }}
          />
        )}
      </motion.aside>
    </>
  );
}

export default function CartDrawer() {
  const { drawerOpen } = useCart();
  return <AnimatePresence>{drawerOpen && <CartPanel key="panel" />}</AnimatePresence>;
}
