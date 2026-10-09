import { toCents } from '../utils/pricing';

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES = [
  { id: 'all', label: 'All items' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
];

export const HERO_IMAGE = img('1568901346375-23c9450c58cd', 1200);

const items = [
  {
    id: 'smokehouse-double',
    name: 'Smokehouse Double',
    category: 'burgers',
    price: 13.5,
    tag: 'Popular',
    featured: true,
    description:
      'Two smashed beef patties, aged cheddar, smoked bacon jam and pickles on a toasted brioche bun.',
    image: img('1550547660-d9450f859349'),
  },
  {
    id: 'classic-ember',
    name: 'Classic Ember',
    category: 'burgers',
    price: 10.5,
    tag: 'Popular',
    description:
      'Our everyday burger: flame-grilled beef, lettuce, tomato, red onion and ember sauce.',
    image: img('1568901346375-23c9450c58cd'),
  },
  {
    id: 'truffle-mushroom',
    name: 'Truffle Mushroom Swiss',
    category: 'burgers',
    price: 12.9,
    description:
      'Beef patty, roasted mushrooms, melted Swiss and a garlic truffle mayo.',
    image: img('1561758033-d89a9ad46330'),
  },
  {
    id: 'jalapeno-heat',
    name: 'Jalapeno Heat',
    category: 'burgers',
    price: 11.9,
    tag: 'Recommended',
    description:
      'Pepper jack, pickled jalapenos, crispy onions and a smoky chipotle spread.',
    image: img('1594212699903-ec8a3eca50f5'),
  },
  {
    id: 'garden-crisp',
    name: 'Garden Crisp Veggie',
    category: 'burgers',
    price: 10.9,
    description:
      'Crispy chickpea and herb patty, avocado, tomato and lemon yogurt sauce.',
    image: img('1520072959219-c595dc870360'),
  },
  {
    id: 'crispy-chicken-sandwich',
    name: 'Crispy Chicken Sandwich',
    category: 'chicken',
    price: 11.5,
    tag: 'Popular',
    featured: true,
    description:
      'Buttermilk-brined chicken fried golden, with slaw and honey pickle mayo.',
    image: img('1626645738196-c2a7c87a8f58'),
  },
  {
    id: 'hot-wings',
    name: 'Ember Hot Wings',
    category: 'chicken',
    price: 9.9,
    tag: 'Recommended',
    description:
      'Eight wings tossed in our slow-burn hot sauce, served with a cooling dip.',
    image: img('1567620832903-9fc6debc209f'),
  },
  {
    id: 'grilled-chicken-plate',
    name: 'Grilled Chicken Plate',
    category: 'chicken',
    price: 12.5,
    description:
      'Herb-marinated grilled chicken thigh with charred corn and lemon rice.',
    image: img('1562967914-608f82629710'),
  },
  {
    id: 'ember-fries',
    name: 'Ember Fries',
    category: 'sides',
    price: 4.5,
    tag: 'Popular',
    featured: true,
    description: 'Skin-on fries, double-fried and finished with smoked sea salt.',
    image: img('1573080496219-bb080dd4f877'),
  },
  {
    id: 'loaded-cheese-fries',
    name: 'Loaded Cheese Fries',
    category: 'sides',
    price: 6.9,
    description:
      'Fries under warm cheese sauce, crispy bacon bits and sliced green onion.',
    image: img('1630384060421-cb20d0e0649d'),
  },
  {
    id: 'onion-rings',
    name: 'Beer-Battered Onion Rings',
    category: 'sides',
    price: 5.2,
    description: 'Thick-cut onion rings in a crunchy golden batter with smoky dip.',
    image: img('1639024471283-03518883512d'),
  },
  {
    id: 'smoked-vanilla-shake',
    name: 'Smoked Vanilla Shake',
    category: 'drinks',
    price: 6.5,
    tag: 'Popular',
    featured: true,
    description: 'Thick vanilla shake with a hint of caramelised sugar and whipped cream.',
    image: img('1572490122747-3968b75cc699'),
  },
  {
    id: 'house-lemonade',
    name: 'House Lemonade',
    category: 'drinks',
    price: 3.9,
    description: 'Fresh-squeezed lemon, mint and just enough sugar. Served over ice.',
    image: img('1621263764928-df1444c5e859'),
  },
  {
    id: 'classic-cola',
    name: 'Ice-Cold Cola',
    category: 'drinks',
    price: 2.9,
    description: 'Classic cola served in a tall glass over crushed ice.',
    image: img('1622483767028-3f66f32aef97'),
  },
];

export const MENU = items.map((item) => ({ ...item, priceCents: toCents(item.price) }));
export const menuById = new Map(MENU.map((item) => [item.id, item]));
export const FEATURED = MENU.filter((item) => item.featured);
