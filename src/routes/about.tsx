import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="about">
      <h1>About La Patrona</h1>
      <p>
        A universal web app built with modern technologies:
      </p>
      <ul>
        <li><strong>Convex</strong> - Real-time backend with automatic sync</li>
        <li><strong>TanStack Router</strong> - Type-safe routing for React</li>
        <li><strong>Vite</strong> - Lightning fast development</li>
        <li><strong>PWA</strong> - Install on iOS, iPad, and Chrome</li>
      </ul>

      <h2>Installation</h2>
      <p>
        On <strong>iOS/iPad</strong>: Tap Share → Add to Home Screen
      </p>
      <p>
        On <strong>Chrome</strong>: Click the install icon in the address bar
      </p>

      <style>{`
        .about {
          max-width: 600px;
        }
        .about h1 {
          margin-bottom: 1rem;
        }
        .about h2 {
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .about p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .about ul {
          list-style: none;
          padding: 0;
        }
        .about li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }
        .about li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #646cff;
        }
      `}</style>
    </div>
  )
}
