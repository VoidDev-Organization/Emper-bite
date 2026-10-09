import { useEffect } from 'react';

/** Prevents the page behind a dialog from scrolling while it is mounted. */
export function useBodyScrollLock() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
}
