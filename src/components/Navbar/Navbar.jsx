import { Link, useLocation } from 'react-router-dom';

/**
 * NAV_LINKS — top-level navigation items.
 * @type {{ label: string, to: string }[]}
 */
const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'About Us', to: '/about' },
];

/**
 * Navbar — fixed top navigation bar.
 * Shows logo on the left, nav links on the right.
 * Active route is highlighted with primary color.
 * Backdrop blur for premium feel over content.
 */
function Navbar() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50
      border-b border-border
      bg-surface/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6
        h-16 flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5
            hover:opacity-80 transition-opacity duration-200"
        >
          <span className="text-2xl">🥘</span>
          <span className="text-lg font-bold tracking-tight">
            Fridge
            <span className="text-primary">Chef</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
