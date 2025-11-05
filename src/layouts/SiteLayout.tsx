import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '../components/ui/Container';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

function NavLink({ to, children }: NavLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <Container>
          <nav className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-xl font-display font-bold text-gray-900">
              Young Minds @ Edura
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:gap-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/express">Express Yourself</NavLink>
              <NavLink to="/challenge">Challenge Yourself</NavLink>
              <NavLink to="/brainy">Brainy Bites</NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">
                {isMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/express">Express Yourself</NavLink>
                <NavLink to="/challenge">Challenge Yourself</NavLink>
                <NavLink to="/brainy">Brainy Bites</NavLink>
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-32 border-t border-gray-200 py-12">
        <Container>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Contact us:{' '}
              <a
                href="mailto:hr@eduraglobal.com"
                className="text-blue-600 hover:text-blue-500"
              >
                hr@eduraglobal.com
              </a>
            </p>
            <div className="mt-4 flex justify-center gap-6">
              {/* Placeholder social icons */}
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-6 w-6 rounded-full bg-gray-200" />
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}