import { Star } from 'lucide-react';
import Reveal from '../Reveal.jsx';

const REVIEWS = [
  {
    quote:
      'The double smash had the crispiest edges I have had on a burger, and the bacon jam is the kind of thing you think about the next day.',
    name: 'Sample reviewer: Maya R.',
    large: true,
  },
  {
    quote: 'Fries stayed hot all the way through the meal.',
    name: 'Sample reviewer: Jonas K.',
  },
  {
    quote: 'Ordering took about a minute and the pickup slot was easy to choose.',
    name: 'Sample reviewer: Lina A.',
  },
];

export default function Reviews() {
  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="reviews-title" className="display section-title">
            What guests might say
          </h2>
          <p className="section-sub">
            Sample testimonials written for this demo. They are not real customer reviews.
          </p>
        </Reveal>

        <div className="reviews-grid">
          {REVIEWS.map((r, index) => (
            <Reveal key={r.name} delay={index * 0.08} className={`review${r.large ? ' review-large' : ''}`}>
              <figure>
                <div className="stars" role="img" aria-label="5 out of 5 stars (sample)">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <blockquote>{r.quote}</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
