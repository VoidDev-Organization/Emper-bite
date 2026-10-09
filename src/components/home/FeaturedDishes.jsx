import ProductCard from '../ProductCard.jsx';
import Reveal from '../Reveal.jsx';
import { FEATURED } from '../../data/menu';

export default function FeaturedDishes() {
  return (
    <section className="section" id="signature" aria-labelledby="signature-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="signature-title" className="display section-title">
            Signature dishes
          </h2>
          <p className="section-sub">
            The four things regulars order first. Add them straight to your cart.
          </p>
        </Reveal>

        <div className="featured-grid">
          {FEATURED.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.07} className={`featured-item featured-item-${index}`}>
              <ProductCard product={product} variant={index === 0 ? 'grid' : 'row'} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
