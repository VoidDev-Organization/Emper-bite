import { calculateTotals, formatMoney } from '../utils/pricing';

export default function PriceSummary({ subtotalCents, mode, estimate = false }) {
  const totals = calculateTotals(subtotalCents, mode);
  const deliveryLabel =
    mode === 'pickup' ? 'Pickup' : estimate ? 'Delivery fee (if delivering)' : 'Delivery fee';

  return (
    <dl className="summary">
      <div className="summary-row">
        <dt>Subtotal</dt>
        <dd>{formatMoney(totals.subtotal)}</dd>
      </div>
      <div className="summary-row">
        <dt>{deliveryLabel}</dt>
        <dd>{totals.deliveryFee === 0 ? 'Free' : formatMoney(totals.deliveryFee)}</dd>
      </div>
      {totals.freeDeliveryRemaining > 0 && (
        <p className="summary-hint">
          Add {formatMoney(totals.freeDeliveryRemaining)} more for free delivery.
        </p>
      )}
      <div className="summary-row summary-total">
        <dt>Total</dt>
        <dd data-testid="order-total">{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  );
}
