export const MAX_QTY = 20;

/** state: array of { id, qty } lines. One line per product. */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((l) => l.id === action.id);
      if (existing) {
        return state.map((l) =>
          l.id === action.id ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l,
        );
      }
      return [...state, { id: action.id, qty: 1 }];
    }
    case 'INC':
      return state.map((l) =>
        l.id === action.id ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l,
      );
    case 'DEC':
      return state
        .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0);
    case 'REMOVE':
      return state.filter((l) => l.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

/** Defensive parse of whatever is in LocalStorage. */
export function sanitizeCart(raw, validIds) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const lines = [];
  for (const line of raw) {
    if (!line || !validIds.has(line.id) || seen.has(line.id)) continue;
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1) continue;
    seen.add(line.id);
    lines.push({ id: line.id, qty: Math.min(qty, MAX_QTY) });
  }
  return lines;
}
