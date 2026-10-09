import { CATEGORIES, MENU } from '../data/menu';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="filter" role="group" aria-label="Filter menu by category">
      {CATEGORIES.map((cat) => {
        const count = cat.id === 'all' ? MENU.length : MENU.filter((m) => m.category === cat.id).length;
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            className={`filter-chip${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(cat.id)}
          >
            {cat.label}
            <span className="filter-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
