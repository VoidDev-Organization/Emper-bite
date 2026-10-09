import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, Loader2, Store } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { validateCheckout } from '../utils/validation';
import { buildOrder } from '../utils/orders';
import PriceSummary from './PriceSummary.jsx';

const FIELD_ORDER = ['name', 'phone', 'address', 'notes'];

function Field({ id, label, error, hint, optional, children }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children({ 'aria-invalid': error ? 'true' : 'false', 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ items, subtotalCents, mode, setMode, onBackToMenu }) {
  const { completeOrder } = useCart();
  const [values, setValues] = useState({ name: '', phone: '', address: '', notes: '' });
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [payment, setPayment] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const mounted = useRef(true);
  const formRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const errors = useMemo(() => validateCheckout(values, mode), [values, mode]);
  const showError = (field) => (attempted || touched[field]) && errors[field];

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const blurField = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const payLabel = mode === 'delivery' ? 'on delivery' : 'at pickup';

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setAttempted(true);
    setFormError('');

    if (items.length === 0) {
      setFormError('Your cart is empty. Add something from the menu before placing an order.');
      return;
    }

    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector(`#checkout-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    // Short delay so the button gives feedback; there is no server round trip in this demo.
    setTimeout(() => {
      if (!mounted.current) return;
      const order = buildOrder({
        items,
        customer: values,
        mode,
        payment: payment === 'cash' ? `Cash ${payLabel}` : `Card ${payLabel}`,
      });
      completeOrder(order);
    }, 650);
  }

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate ref={formRef}>
      <div className="drawer-scroll">
        <p className="demo-note">
          Frontend demo: your order is saved on this device only. It is not sent to a restaurant or
          server, and no payment is taken.
        </p>

        <fieldset className="choice-group">
          <legend>How would you like to get it?</legend>
          <div className="choice-row">
            <label className={`choice${mode === 'delivery' ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="mode"
                value="delivery"
                checked={mode === 'delivery'}
                onChange={() => setMode('delivery')}
              />
              <Bike size={20} aria-hidden="true" />
              <span>
                <strong>Delivery</strong>
                <small>$3.50, free over $35</small>
              </span>
            </label>
            <label className={`choice${mode === 'pickup' ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="mode"
                value="pickup"
                checked={mode === 'pickup'}
                onChange={() => setMode('pickup')}
              />
              <Store size={20} aria-hidden="true" />
              <span>
                <strong>Pickup</strong>
                <small>No fee</small>
              </span>
            </label>
          </div>
        </fieldset>

        <Field id="checkout-name" label="Full name" error={showError('name')}>
          {(aria) => (
            <input
              id="checkout-name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={setField('name')}
              onBlur={blurField('name')}
              {...aria}
            />
          )}
        </Field>

        <Field id="checkout-phone" label="Phone number" error={showError('phone')} hint="We would call this number about your order.">
          {(aria) => (
            <input
              id="checkout-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={setField('phone')}
              onBlur={blurField('phone')}
              {...aria}
            />
          )}
        </Field>

        {mode === 'delivery' && (
          <Field id="checkout-address" label="Delivery address" error={showError('address')}>
            {(aria) => (
              <textarea
                id="checkout-address"
                rows={2}
                autoComplete="street-address"
                value={values.address}
                onChange={setField('address')}
                onBlur={blurField('address')}
                {...aria}
              />
            )}
          </Field>
        )}

        <Field id="checkout-notes" label="Order notes" optional error={showError('notes')} hint={`${values.notes.length}/200`}>
          {(aria) => (
            <textarea
              id="checkout-notes"
              rows={2}
              placeholder="No onions, extra napkins..."
              value={values.notes}
              onChange={setField('notes')}
              onBlur={blurField('notes')}
              {...aria}
            />
          )}
        </Field>

        <fieldset className="choice-group">
          <legend>Payment method</legend>
          <div className="choice-row">
            <label className={`choice choice-simple${payment === 'cash' ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === 'cash'}
                onChange={() => setPayment('cash')}
              />
              <span>
                <strong>Cash</strong>
                <small>Pay {payLabel}</small>
              </span>
            </label>
            <label className={`choice choice-simple${payment === 'card' ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
              />
              <span>
                <strong>Card terminal</strong>
                <small>Pay {payLabel}</small>
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      <footer className="drawer-foot">
        <PriceSummary subtotalCents={subtotalCents} mode={mode} />
        {formError && (
          <p className="form-error" role="alert">
            {formError}{' '}
            <button type="button" className="link-btn" onClick={onBackToMenu}>
              Browse the menu
            </button>
          </p>
        )}
        <motion.button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" aria-hidden="true" /> Placing demo order...
            </>
          ) : (
            'Place demo order'
          )}
        </motion.button>
      </footer>
    </form>
  );
}
