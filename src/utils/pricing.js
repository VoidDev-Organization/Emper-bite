// All money maths is done in integer cents to avoid floating point drift.
export const DELIVERY_FEE_CENTS = 350;
export const FREE_DELIVERY_THRESHOLD_CENTS = 3500;

export const toCents = (price) => Math.round(price * 100);

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatMoney = (cents) => currency.format(cents / 100);

/**
 * Demo pricing rules:
 *  - Pickup: no fee.
 *  - Delivery: flat $3.50, free once the subtotal reaches $35.
 */
export function calculateTotals(subtotalCents, mode = 'delivery') {
  const qualifiesForFee =
    mode === 'delivery' &&
    subtotalCents > 0 &&
    subtotalCents < FREE_DELIVERY_THRESHOLD_CENTS;

  const deliveryFee = qualifiesForFee ? DELIVERY_FEE_CENTS : 0;
  const freeDeliveryRemaining = qualifiesForFee
    ? FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents
    : 0;

  return {
    subtotal: subtotalCents,
    deliveryFee,
    total: subtotalCents + deliveryFee,
    freeDeliveryRemaining,
  };
}
