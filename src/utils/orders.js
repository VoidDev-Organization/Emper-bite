import { calculateTotals } from './pricing';

export const ORDERS_KEY = 'ember-bite:orders:v1';
const MAX_SAVED_ORDERS = 20;

export function loadOrders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function generateOrderRef(existing = loadOrders()) {
  const used = new Set(existing.map((o) => o.ref));
  let ref;
  do {
    const time = Date.now().toString(36).toUpperCase().slice(-5);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 5).padEnd(3, 'X');
    ref = `EB-${time}-${rand}`;
  } while (used.has(ref));
  return ref;
}

export function buildOrder({ items, customer, mode, payment }) {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const totals = calculateTotals(subtotal, mode);
  return {
    ref: generateOrderRef(),
    createdAt: new Date().toISOString(),
    status: 'Demo order - saved on this device only',
    mode,
    payment,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: mode === 'delivery' ? customer.address.trim() : '',
      notes: customer.notes.trim(),
    },
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      qty: i.qty,
      unitPrice: i.priceCents,
      lineTotal: i.lineTotal,
    })),
    totals,
  };
}

export function saveOrder(order) {
  try {
    const next = [order, ...loadOrders()].slice(0, MAX_SAVED_ORDERS);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}
