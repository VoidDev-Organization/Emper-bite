import { Link } from 'react-router-dom';
import { Facebook, Flame, Instagram, Twitter } from 'lucide-react';

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook },
  { label: 'X (Twitter)', href: 'https://x.com/', Icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand brand-light" aria-label="EMBER & BITE home">
            <span className="brand-mark">
              <Flame size={20} aria-hidden="true" />
            </span>
            <span className="brand-name">
              EMBER <span>&amp;</span> BITE
            </span>
          </Link>
          <p>Smashed burgers, crispy chicken and fries worth the wait.</p>
          <ul className="social" aria-label="Social media">
            {SOCIAL.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="footer-title">Navigate</h2>
          <ul className="footer-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/order">Order Now</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Opening hours (demo)</h2>
          <ul className="footer-list">
            <li>Mon to Thu: 11:00 - 22:00</li>
            <li>Fri and Sat: 11:00 - 23:30</li>
            <li>Sunday: 12:00 - 21:00</li>
          </ul>
        </div>

        <div>
          <h2 className="footer-title">Contact (sample)</h2>
          <ul className="footer-list">
            <li>123 Sample Street, Demo City</li>
            <li>+1 (555) 010-0199</li>
            <li>hello@example.com</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} EMBER &amp; BITE. This is a fictional restaurant built as
          a frontend demo. Hours and contact details are samples, and orders are not sent anywhere.
        </p>
      </div>
    </footer>
  );
}
