import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import FoodImage from '../FoodImage.jsx';
import { HERO_IMAGE, menuById } from '../../data/menu';
import { useCart } from '../../context/CartContext.jsx';
import { formatMoney } from '../../utils/pricing';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const rise = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const { addItem } = useCart();
  const signature = menuById.get('smokehouse-double');

  return (
    <section className="hero">
      <div className="container hero-grid">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="visible">
          <h1 className="hero-title display">
            <motion.span variants={rise}>Big flavor.</motion.span>
            <motion.span variants={rise} className="hero-title-accent">
              Zero compromise.
            </motion.span>
          </h1>
          <motion.p variants={rise} className="hero-lead">
            EMBER &amp; BITE is a burger kitchen built around one idea: smash it hot, season it
            boldly and send it out while it still sizzles. Pick your favorites and order in under
            a minute.
          </motion.p>
          <motion.div variants={rise} className="btn-row">
            <Link to="/order" className="btn btn-primary btn-lg">
              Order Now
            </Link>
            <a href="#signature" className="btn btn-ghost btn-lg">
              Explore Our Menu
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-media"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-arch">
            <FoodImage
              src={HERO_IMAGE}
              alt="A stacked beef burger with melted cheese on a toasted bun"
              category="burgers"
              eager
              width={1200}
              height={1500}
            />
          </div>
          <div className="hero-ticket">
            <div>
              <p className="hero-ticket-name">{signature.name}</p>
              <p className="hero-ticket-price">{formatMoney(signature.priceCents)}</p>
            </div>
            <motion.button
              type="button"
              className="btn btn-primary btn-round"
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(signature.id)}
              aria-label={`Add ${signature.name} to cart`}
            >
              <Plus size={20} aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
