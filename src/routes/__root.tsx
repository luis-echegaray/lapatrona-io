import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { config } from '../config'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="app">
      <header className="app-header">
        <nav>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </nav>
        <div className="version-badge">
          v{config.version}
          {config.environment !== 'production' && (
            <span className="env-badge">{config.environment}</span>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
      <style>{`
        .app {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        .app-header {
          padding: 1rem;
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .app-header nav {
          display: flex;
          gap: 1rem;
        }
        .version-badge {
          font-size: 0.75rem;
          color: #888;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .env-badge {
          background: #646cff;
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.625rem;
          text-transform: uppercase;
        }
        .nav-link {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .nav-link:hover {
          background: #333;
        }
        .nav-link[data-status="active"] {
          background: #646cff;
          color: white;
        }
        .app-main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        @media (prefers-color-scheme: light) {
          .app-header {
            background: #f5f5f5;
            border-bottom-color: #ddd;
          }
          .nav-link:hover {
            background: #e0e0e0;
          }
        }
      `}</style>
    </div>
  )
}
