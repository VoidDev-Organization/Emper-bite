import { useEffect, useState } from 'react';

const FALLBACK_TINT = {
  burgers: '#c8461a',
  chicken: '#b9741f',
  sides: '#a8531c',
  drinks: '#8f4a2a',
  default: '#c8461a',
};

/** Inline SVG shown when a remote photo fails to load, so layouts never collapse. */
export function fallbackImage(category = 'default') {
  const tint = FALLBACK_TINT[category] || FALLBACK_TINT.default;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#1d1b19"/><circle cx="400" cy="300" r="190" fill="${tint}" opacity=".22"/><path d="M400 150c16 56 88 88 88 176a88 88 0 0 1-176 0c0-40 24-64 40-88 8 24 24 32 32 32 8-32 0-72 16-120z" fill="${tint}"/><path d="M400 330c12 24 40 36 40 68a40 40 0 0 1-80 0c0-24 16-32 24-48 8 10 13 11 16 11z" fill="#f1e6d3"/><text x="400" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="6" fill="#f1e6d3" opacity=".7">EMBER &amp; BITE</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function FoodImage({
  src,
  alt,
  category,
  className = '',
  eager = false,
  width = 800,
  height = 600,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      className={className}
      src={failed ? fallbackImage(category) : src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
