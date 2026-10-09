import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="EMBER & BITE home">
          <span className="brand-mark">
            <Flame size={20} aria-hidden="true" />
          </span>
          <span className="brand-name">
            EMBER <span>&amp;</span> BITE
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/order" className={linkClass}>
            Order Now
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={22} aria-hidden="true" />
            <AnimatePresence initial={false}>
              {count > 0 && (
                <motion.span
                  key={count}
                  className="cart-badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link to="/order" className="btn btn-primary nav-cta">
            Order Now
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container mobile-menu-inner">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/order" className={linkClass}>
                Order Now
              </NavLink>
              <Link to="/order" className="btn btn-primary btn-block">
                Start your order
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
