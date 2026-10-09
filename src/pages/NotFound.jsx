import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';

export default function NotFound() {
  return (
    <PageTransition>
      <section className="container not-found">
        <h1 className="display">Page not found</h1>
        <p>That page is not on the menu. Head back home or start an order.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/order">
            Order now
          </Link>
          <Link className="btn btn-ghost" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
