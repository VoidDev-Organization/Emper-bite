import { ChefHat, Flame, Leaf, Smartphone } from 'lucide-react';
import Reveal from '../Reveal.jsx';

const POINTS = [
  {
    Icon: Leaf,
    title: 'Fresh ingredients',
    text: 'Beef ground in-house, produce delivered daily, buns toasted to order.',
  },
  {
    Icon: Flame,
    title: 'Bold flavors',
    text: 'Smoked salts, house sauces and a proper sear on every patty.',
  },
  {
    Icon: ChefHat,
    title: 'Made with care',
    text: 'Every order is cooked when you place it, never held under a lamp.',
  },
  {
    Icon: Smartphone,
    title: 'Easy ordering',
    text: 'Build your cart, choose delivery or pickup and check out in a minute.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section section-cream" aria-labelledby="why-title">
      <div className="container">
        <Reveal>
          <h2 id="why-title" className="display section-title">
            Why people keep coming back
          </h2>
        </Reveal>
        <ul className="why-list">
          {POINTS.map(({ Icon, title, text }, index) => (
            <li key={title} className="why-item">
              <Reveal delay={index * 0.06}>
                <span className="why-icon">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
