import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CATEGORIES, MENU } from '../data/menu';
import { useCart } from '../context/CartContext.jsx';
import { formatMoney } from '../utils/pricing';

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function Order() {
  const [category, setCategory] = useState('all');
  const { count, subtotalCents, openCart } = useCart();

  const products = useMemo(
    () => (category === 'all' ? MENU : MENU.filter((p) => p.category === category)),
    [category],
  );
  const activeLabel = CATEGORIES.find((c) => c.id === category)?.label;

  return (
    <PageTransition>
      <section className="order-head">
        <div className="container order-head-inner">
          <div>
            <h1 className="display page-title">Build your order</h1>
            <p className="page-lead">
              Pick from the menu, adjust your cart and check out as delivery or pickup. Everything
              here is a demo: orders stay on your device.
            </p>
          </div>
          <button type="button" className="btn btn-dark order-head-cart" onClick={openCart}>
            <ShoppingBag size={18} aria-hidden="true" />
            View cart ({count})
          </button>
        </div>
      </section>

      <section className="container order-body" aria-label="Menu">
        <div className="filter-bar">
          <CategoryFilter active={category} onChange={setCategory} />
          <p className="filter-status" aria-live="polite">
            Showing {products.length} {products.length === 1 ? 'item' : 'items'} in {activeLabel}
          </p>
        </div>

        <motion.div
          key={category}
          className="product-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            className="cart-bar"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <button type="button" onClick={openCart}>
              <span className="cart-bar-count">
                <ShoppingBag size={18} aria-hidden="true" />
                {count} {count === 1 ? 'item' : 'items'}
              </span>
              <span className="cart-bar-action">View cart {formatMoney(subtotalCents)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
