import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Keeps keyboard focus inside a dialog, closes on Escape and restores focus on unmount. */
export function useFocusTrap(ref, onEscape) {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const previous = document.activeElement;
    const getFocusable = () => Array.from(node.querySelectorAll(FOCUSABLE));

    (getFocusable()[0] || node).focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [ref]);
}
