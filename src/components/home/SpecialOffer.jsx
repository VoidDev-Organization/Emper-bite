import { Link } from 'react-router-dom';
import Reveal from '../Reveal.jsx';
import FoodImage from '../FoodImage.jsx';
import { menuById } from '../../data/menu';

export default function SpecialOffer() {
  const image = menuById.get('loaded-cheese-fries');
  return (
    <section className="offer" aria-labelledby="offer-title">
      <div className="container offer-grid">
        <Reveal className="offer-copy">
          <p className="offer-flag">Sample offer for demo purposes only</p>
          <h2 id="offer-title" className="display offer-title">
            The Ember Duo
          </h2>
          <p className="offer-text">
            Two burgers, two fries and two drinks for one friendly price. A made-up promotion to
            show how a meal deal could look on this site.
          </p>
          <p className="offer-price">
            <span className="offer-price-now">$29.90</span>
            <span className="offer-price-was">$37.80</span>
          </p>
          <Link to="/order" className="btn btn-primary btn-lg">
            Order Now
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="offer-media">
          <FoodImage src={image.image} alt="Fries topped with melted cheese sauce" category="sides" />
        </Reveal>
      </div>
    </section>
  );
}
