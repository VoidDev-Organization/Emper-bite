import { describe, expect, it } from 'vitest';
import { cartReducer, sanitizeCart, MAX_QTY } from '../context/cartReducer';
import { calculateTotals, formatMoney, toCents } from '../utils/pricing';
import { validateCheckout } from '../utils/validation';
import { generateOrderRef, buildOrder } from '../utils/orders';
import { MENU, CATEGORIES } from '../data/menu';

describe('cartReducer', () => {
  it('adds the same product twice as one line with qty 2', () => {
    let s = cartReducer([], { type: 'ADD', id: 'ember-fries' });
    s = cartReducer(s, { type: 'ADD', id: 'ember-fries' });
    expect(s).toEqual([{ id: 'ember-fries', qty: 2 }]);
  });
  it('decrements and removes at zero', () => {
    let s = [{ id: 'a', qty: 2 }];
    s = cartReducer(s, { type: 'DEC', id: 'a' });
    expect(s[0].qty).toBe(1);
    s = cartReducer(s, { type: 'DEC', id: 'a' });
    expect(s).toEqual([]);
  });
  it('caps quantity, removes and clears', () => {
    let s = [{ id: 'a', qty: MAX_QTY }];
    expect(cartReducer(s, { type: 'INC', id: 'a' })[0].qty).toBe(MAX_QTY);
    expect(cartReducer(s, { type: 'REMOVE', id: 'a' })).toEqual([]);
    expect(cartReducer(s, { type: 'CLEAR' })).toEqual([]);
  });
  it('sanitizes bad storage data', () => {
    const ids = new Set(['a', 'b']);
    expect(sanitizeCart('nope', ids)).toEqual([]);
    expect(
      sanitizeCart(
        [{ id: 'a', qty: 2 }, { id: 'a', qty: 5 }, { id: 'zzz', qty: 1 }, { id: 'b', qty: -3 }, { id: 'b', qty: 999 }],
        ids,
      ),
    ).toEqual([{ id: 'a', qty: 2 }, { id: 'b', qty: MAX_QTY }]);
  });
});

describe('pricing', () => {
  it('converts without float drift', () => {
    expect(toCents(10.9) + toCents(12.9)).toBe(2380);
    expect(formatMoney(2380)).toBe('$23.80');
  });
  it('applies delivery fee under the threshold only', () => {
    expect(calculateTotals(2000, 'delivery')).toMatchObject({ deliveryFee: 350, total: 2350, freeDeliveryRemaining: 1500 });
    expect(calculateTotals(3500, 'delivery')).toMatchObject({ deliveryFee: 0, total: 3500 });
    expect(calculateTotals(2000, 'pickup')).toMatchObject({ deliveryFee: 0, total: 2000 });
    expect(calculateTotals(0, 'delivery')).toMatchObject({ deliveryFee: 0, total: 0 });
  });
});

describe('validation', () => {
  const ok = { name: 'Amina Uwase', phone: '+250 788 123 456', address: '12 KG 7 Ave, Kigali', notes: '' };
  it('accepts valid delivery details', () => expect(validateCheckout(ok, 'delivery')).toEqual({}));
  it('does not require an address for pickup', () =>
    expect(validateCheckout({ ...ok, address: '' }, 'pickup')).toEqual({}));
  it('flags bad fields', () => {
    const e = validateCheckout({ name: '', phone: 'abc', address: 'x', notes: 'n'.repeat(201) }, 'delivery');
    expect(Object.keys(e).sort()).toEqual(['address', 'name', 'notes', 'phone']);
  });
});

describe('orders and menu data', () => {
  it('generates unique refs', () => {
    const refs = new Set(Array.from({ length: 200 }, () => generateOrderRef([])));
    expect(refs.size).toBeGreaterThan(190);
    [...refs].forEach((r) => expect(r).toMatch(/^EB-[A-Z0-9]{5}-[A-Z0-9]{3}$/));
  });
  it('builds an order with correct totals', () => {
    const item = MENU[0];
    const order = buildOrder({
      items: [{ ...item, qty: 2, lineTotal: item.priceCents * 2 }],
      customer: { name: ' A B ', phone: '1234567', address: '', notes: '' },
      mode: 'delivery',
      payment: 'Cash on delivery',
    });
    expect(order.totals.subtotal).toBe(item.priceCents * 2);
    expect(order.totals.total).toBe(item.priceCents * 2 + order.totals.deliveryFee);
    expect(order.customer.name).toBe('A B');
  });
  it('has 12+ items, unique ids and every category used', () => {
    expect(MENU.length).toBeGreaterThanOrEqual(12);
    expect(new Set(MENU.map((m) => m.id)).size).toBe(MENU.length);
    CATEGORIES.filter((c) => c.id !== 'all').forEach((c) =>
      expect(MENU.some((m) => m.category === c.id)).toBe(true),
    );
  });
});
