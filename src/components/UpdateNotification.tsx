import { useVersionCheck } from '../hooks/useVersionCheck'

interface UpdateNotificationProps {
  /** How often to check for updates in milliseconds (default: 60 seconds) */
  checkInterval?: number
}

export function UpdateNotification({ checkInterval = 60_000 }: UpdateNotificationProps) {
  const { updateAvailable, newVersion, currentVersion, dismissUpdate, refresh } = useVersionCheck(checkInterval)

  if (!updateAvailable) return null

  return (
    <>
      <div className="update-notification">
        <div className="update-content">
          <span className="update-icon">🔄</span>
          <div className="update-text">
            <strong>New version available!</strong>
            <span className="update-versions">
              {currentVersion} → {newVersion}
            </span>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={refresh} className="update-btn update-btn-primary">
            Update Now
          </button>
          <button onClick={dismissUpdate} className="update-btn update-btn-dismiss">
            Later
          </button>
        </div>
      </div>
      <style>{`
        .update-notification {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a2e;
          border: 1px solid #646cff;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 8px 32px rgba(100, 108, 255, 0.3);
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .update-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .update-icon {
          font-size: 1.5rem;
        }

        .update-text {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .update-text strong {
          color: #fff;
          font-size: 0.9rem;
        }

        .update-versions {
          color: #888;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .update-actions {
          display: flex;
          gap: 0.5rem;
        }

        .update-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .update-btn-primary {
          background: #646cff;
          color: white;
        }

        .update-btn-primary:hover {
          background: #535bf2;
        }

        .update-btn-dismiss {
          background: transparent;
          color: #888;
          border: 1px solid #333;
        }

        .update-btn-dismiss:hover {
          background: #333;
          color: #fff;
        }

        @media (prefers-color-scheme: light) {
          .update-notification {
            background: #fff;
            border-color: #646cff;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          }

          .update-text strong {
            color: #1a1a1a;
          }

          .update-btn-dismiss {
            border-color: #ddd;
            color: #666;
          }

          .update-btn-dismiss:hover {
            background: #f5f5f5;
            color: #1a1a1a;
          }
        }

        @media (max-width: 480px) {
          .update-notification {
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
            transform: none;
            flex-direction: column;
            gap: 1rem;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .update-actions {
            width: 100%;
          }

          .update-btn {
            flex: 1;
          }
        }
      `}</style>
    </>
  )
}
