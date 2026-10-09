import { describe, expect, it } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from '../App.jsx';
import { CartProvider, CART_KEY } from '../context/CartContext.jsx';
import { ORDERS_KEY } from '../utils/orders';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MotionConfig reducedMotion="always">
        <CartProvider>
          <App />
        </CartProvider>
      </MotionConfig>
    </MemoryRouter>,
  );
}

describe('EMBER & BITE app', () => {
  it('renders both routes directly', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { level: 1, name: /big flavor/i })).toBeInTheDocument();
    renderApp('/order');
    expect(await screen.findByRole('heading', { level: 1, name: /build your order/i })).toBeInTheDocument();
  });

  it('filters the menu by category', async () => {
    const user = userEvent.setup();
    renderApp('/order');
    await screen.findByRole('heading', { level: 1, name: /build your order/i });
    await user.click(screen.getByRole('button', { name: /^Drinks/ }));
    expect(screen.getByText(/Showing 3 items in Drinks/)).toBeInTheDocument();
    expect(screen.queryByText('Smokehouse Double')).not.toBeInTheDocument();
  });

  it('adds from home and order pages, merges duplicates and persists', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Add Ember Fries to cart' }));
    await user.click(screen.getByRole('button', { name: 'Add Ember Fries to cart' }));
    expect(screen.getByRole('button', { name: /Open cart, 2 items/ })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CART_KEY))).toEqual([{ id: 'ember-fries', qty: 2 }]);
  });

  it('runs the full cart -> checkout -> confirmation flow', async () => {
    const user = userEvent.setup();
    renderApp('/order');
    await screen.findByRole('heading', { level: 1, name: /build your order/i });

    await user.click(screen.getByRole('button', { name: 'Add Classic Ember to cart' })); // 10.50
    await user.click(screen.getByRole('button', { name: 'Add Ember Fries to cart' })); // 4.50
    await user.click(screen.getByRole('button', { name: /Open cart/ }));

    const dialog = await screen.findByRole('dialog', { name: /your cart/i });
    expect(within(dialog).getByTestId('order-total')).toHaveTextContent('$18.50'); // 15.00 + 3.50

    await user.click(within(dialog).getByRole('button', { name: 'Increase quantity of Ember Fries' }));
    expect(within(dialog).getByTestId('order-total')).toHaveTextContent('$23.00'); // 19.50 + 3.50

    await user.click(within(dialog).getByRole('button', { name: 'Remove Ember Fries from cart' }));
    await waitFor(() => expect(within(dialog).queryByText('Ember Fries')).not.toBeInTheDocument());

    await user.click(within(dialog).getByRole('button', { name: 'Go to checkout' }));

    // validation blocks empty submit
    await user.click(within(dialog).getByRole('button', { name: 'Place demo order' }));
    expect(await within(dialog).findByText('Enter your full name.')).toBeInTheDocument();
    expect(within(dialog).getByText('Enter your delivery address.')).toBeInTheDocument();
    expect(localStorage.getItem(ORDERS_KEY)).toBeNull();

    // pickup removes fee and address requirement
    await user.click(within(dialog).getByLabelText(/Pickup/));
    expect(within(dialog).getByTestId('order-total')).toHaveTextContent('$10.50');
    expect(within(dialog).queryByLabelText('Delivery address')).not.toBeInTheDocument();

    await user.type(within(dialog).getByLabelText('Full name'), 'Amina Uwase');
    await user.type(within(dialog).getByLabelText('Phone number'), '+250 788 123 456');
    await user.click(within(dialog).getByRole('button', { name: 'Place demo order' }));

    const confirm = await screen.findByRole('dialog', { name: /order received/i }, { timeout: 3000 });
    expect(within(confirm).getByText(/EB-/)).toBeInTheDocument();
    expect(within(confirm).getByText(/frontend demo/i)).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].totals.total).toBe(1050);
    expect(JSON.parse(localStorage.getItem(CART_KEY))).toEqual([]);
  });

  it('shows an empty-cart state', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: /Open cart, 0 items/ }));
    expect(await screen.findByText('Your cart is empty')).toBeInTheDocument();
  });
});
