import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import FoodImage from './FoodImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatMoney } from '../utils/pricing';

const CATEGORY_LABEL = { burgers: 'Burger', chicken: 'Chicken', sides: 'Side', drinks: 'Drink' };

/**
 * variant "grid": image on top (Order page).
 * variant "row":  image beside the text (Home page featured list).
 */
export default function ProductCard({ product, variant = 'grid' }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef();
  const inCart = items.find((i) => i.id === product.id)?.qty || 0;

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleAdd() {
    addItem(product.id);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1300);
  }

  return (
    <article className={`product product-${variant}`}>
      <div className="product-media">
        <FoodImage
          src={product.image}
          alt={`${product.name}: ${product.description}`}
          category={product.category}
        />
        {product.tag && <span className="product-tag">{product.tag}</span>}
      </div>

      <div className="product-body">
        <p className="product-category">{CATEGORY_LABEL[product.category]}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-foot">
          <p className="product-price">{formatMoney(product.priceCents)}</p>
          <motion.button
            type="button"
            className={`btn btn-add${justAdded ? ' is-added' : ''}`}
            onClick={handleAdd}
            whileTap={{ scale: 0.94 }}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={16} aria-hidden="true" /> Added
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" /> Add to cart
              </>
            )}
          </motion.button>
        </div>
        {inCart > 0 && <p className="product-incart">{inCart} in your cart</p>}
      </div>
    </article>
  );
}
