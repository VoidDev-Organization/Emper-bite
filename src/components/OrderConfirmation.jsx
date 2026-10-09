import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js';
import { formatMoney } from '../utils/pricing';

function ConfirmationDialog({ order, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, onClose);
  useBodyScrollLock();

  const isDelivery = order.mode === 'delivery';

  return (
    <>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="modal-wrap">
        <motion.div
          ref={ref}
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          tabIndex={-1}
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close confirmation">
            <X size={22} aria-hidden="true" />
          </button>

          <motion.svg
            className="check"
            viewBox="0 0 52 52"
            width="64"
            height="64"
            aria-hidden="true"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              strokeWidth="3"
              variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
              transition={{ duration: 0.5 }}
            />
            <motion.path
              d="M15 27l8 8 14-16"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
          </motion.svg>

          <h2 id="confirm-title" className="display modal-title">
            Order received
          </h2>
          <p className="modal-ref">
            Reference <strong>{order.ref}</strong>
          </p>

          <p className="demo-note">
            <Info size={16} aria-hidden="true" />
            <span>
              This is a frontend demo. Your order is stored in this browser only and was not sent to
              a restaurant. No payment was processed.
            </span>
          </p>

          <ul className="receipt">
            {order.items.map((i) => (
              <li key={i.id}>
                <span>
                  {i.qty} x {i.name}
                </span>
                <span>{formatMoney(i.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="summary">
            <div className="summary-row">
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.totals.subtotal)}</dd>
            </div>
            <div className="summary-row">
              <dt>{isDelivery ? 'Delivery fee' : 'Pickup'}</dt>
              <dd>{order.totals.deliveryFee === 0 ? 'Free' : formatMoney(order.totals.deliveryFee)}</dd>
            </div>
            <div className="summary-row summary-total">
              <dt>Total</dt>
              <dd>{formatMoney(order.totals.total)}</dd>
            </div>
          </dl>

          <dl className="details">
            <div>
              <dt>Name</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{order.customer.phone}</dd>
            </div>
            <div>
              <dt>{isDelivery ? 'Delivery to' : 'Pickup'}</dt>
              <dd>{isDelivery ? order.customer.address : 'Collect at the counter'}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{order.payment}</dd>
            </div>
            {order.customer.notes && (
              <div>
                <dt>Notes</dt>
                <dd>{order.customer.notes}</dd>
              </div>
            )}
          </dl>

          <div className="btn-row">
            <Link to="/order" className="btn btn-primary" onClick={onClose}>
              Order something else
            </Link>
            <Link to="/" className="btn btn-ghost" onClick={onClose}>
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function OrderConfirmation() {
  const { lastOrder, dismissOrder } = useCart();
  return (
    <AnimatePresence>
      {lastOrder && <ConfirmationDialog key={lastOrder.ref} order={lastOrder} onClose={dismissOrder} />}
    </AnimatePresence>
  );
}
