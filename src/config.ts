/**
 * Runtime Configuration
 *
 * This module provides type-safe access to runtime configuration.
 * In production, config is loaded from /config.js (generated at container startup).
 * In development, it falls back to Vite environment variables.
 *
 * Environment Variable Naming Convention:
 * - Container env vars: APP_CONVEX_URL, APP_FEATURE_FLAG, etc.
 * - Vite env vars: VITE_CONVEX_URL, VITE_FEATURE_FLAG, etc.
 * - Config keys: convexUrl, featureFlag, etc. (camelCase)
 */

// Type definition for runtime config
export interface AppConfig {
  // Core
  convexUrl: string;

  // App metadata
  version: string;
  environment: string;

  // Feature flags (add more as needed)
  // featureNewUi?: string;
  // featureAnalytics?: string;

  // API endpoints (add more as needed)
  // apiBaseUrl?: string;

  // Third-party integrations (add more as needed)
  // sentryDsn?: string;
  // analyticsId?: string;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __APP_CONFIG__?: Partial<AppConfig>;
  }
}

/**
 * Get configuration value with fallback chain:
 * 1. Runtime config (window.__APP_CONFIG__ from config.js)
 * 2. Vite environment variable (import.meta.env.VITE_*)
 * 3. Default value
 */
function getConfigValue(
  key: keyof AppConfig,
  viteEnvKey: string,
  defaultValue: string = ""
): string {
  // Try runtime config first (production)
  const runtimeValue = window.__APP_CONFIG__?.[key];
  if (runtimeValue !== undefined && runtimeValue !== "") {
    return runtimeValue;
  }

  // Fall back to Vite env var (development)
  const viteValue = import.meta.env[viteEnvKey];
  if (viteValue !== undefined && viteValue !== "") {
    return viteValue;
  }

  // Return default
  return defaultValue;
}

/**
 * Application configuration object
 * Access config values like: config.convexUrl
 */
export const config: AppConfig = {
  // Core - Convex backend URL
  convexUrl: getConfigValue("convexUrl", "VITE_CONVEX_URL"),

  // App metadata
  version: getConfigValue("version", "VITE_VERSION", "dev"),
  environment: getConfigValue("environment", "VITE_ENVIRONMENT", "development"),
};

/**
 * Validate required configuration
 * Call this early in app initialization to fail fast on missing config
 */
export function validateConfig(): void {
  const required: (keyof AppConfig)[] = ["convexUrl"];

  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(", ")}. ` +
        `Set APP_* environment variables in production or VITE_* in development.`
    );
  }
}

/**
 * Log current configuration (for debugging)
 * Masks sensitive values
 */
export function logConfig(): void {
  const safeConfig = { ...config };

  // Mask sensitive values (add patterns as needed)
  const sensitivePatterns = ["key", "secret", "token", "password", "dsn"];

  for (const [key, value] of Object.entries(safeConfig)) {
    if (
      sensitivePatterns.some((pattern) => key.toLowerCase().includes(pattern))
    ) {
      (safeConfig as Record<string, string>)[key] = value ? "***" : "";
    }
  }

  console.log("[Config] Runtime configuration:", safeConfig);
}

export default config;
