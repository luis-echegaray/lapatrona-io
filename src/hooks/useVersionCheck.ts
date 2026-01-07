import { useEffect, useState, useCallback } from 'react'
import { config } from '../config'

interface VersionCheckState {
  updateAvailable: boolean
  newVersion: string | null
  currentVersion: string
}

/**
 * Hook that periodically checks for new app versions.
 * Shows notification when a newer version is deployed.
 *
 * @param intervalMs - How often to check (default: 60 seconds)
 */
export function useVersionCheck(intervalMs: number = 60_000): VersionCheckState & { dismissUpdate: () => void; refresh: () => void } {
  const [state, setState] = useState<VersionCheckState>({
    updateAvailable: false,
    newVersion: null,
    currentVersion: config.version,
  })
  const [dismissed, setDismissed] = useState(false)

  const checkVersion = useCallback(async () => {
    try {
      // Fetch VERSION file with cache-busting
      const response = await fetch(`/VERSION?_=${Date.now()}`)
      if (!response.ok) return

      const latestVersion = (await response.text()).trim()

      // Compare versions - if different and not 'dev', we have an update
      if (latestVersion !== config.version && latestVersion !== 'dev' && config.version !== 'dev') {
        setState(prev => ({
          ...prev,
          updateAvailable: true,
          newVersion: latestVersion,
        }))
      }
    } catch (error) {
      // Silent fail - don't bother user if version check fails
      console.debug('Version check failed:', error)
    }
  }, [])

  useEffect(() => {
    // Initial check after short delay (let app load first)
    const initialTimeout = setTimeout(checkVersion, 5000)

    // Periodic checks
    const interval = setInterval(checkVersion, intervalMs)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [checkVersion, intervalMs])

  const dismissUpdate = useCallback(() => {
    setDismissed(true)
  }, [])

  const refresh = useCallback(() => {
    // Hard refresh to get new version
    window.location.reload()
  }, [])

  return {
    ...state,
    updateAvailable: state.updateAvailable && !dismissed,
    dismissUpdate,
    refresh,
  }
}
