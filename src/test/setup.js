import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no IntersectionObserver (used by Framer Motion's whileInView)
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IO;
window.scrollTo = vi.fn();
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));

afterEach(() => {
  cleanup();
  localStorage.clear();
});
