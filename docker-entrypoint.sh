#!/bin/bash
set -e

# Generate runtime configuration from environment variables
# This enables "build once, deploy anywhere" pattern

CONFIG_FILE="/usr/share/nginx/html/config.js"
VERSION_FILE="/usr/share/nginx/html/VERSION"

# Read version from baked-in file (single source of truth)
# This was written during Docker build from the CalVer tag
if [ -f "$VERSION_FILE" ] && [ -z "$APP_VERSION" ]; then
  export APP_VERSION=$(cat "$VERSION_FILE")
  echo "Version loaded from image: $APP_VERSION"
fi

echo "Generating runtime configuration..."

# Start the config object
cat > "$CONFIG_FILE" << 'EOF'
// Runtime configuration - generated at container startup
// DO NOT EDIT - this file is regenerated on every container start
window.__APP_CONFIG__ = {
EOF

# Add all APP_* environment variables to the config
# Format: APP_CONVEX_URL -> convexUrl
env | grep "^APP_" | while IFS='=' read -r name value; do
  # Remove APP_ prefix and convert to camelCase
  key=$(echo "$name" | sed 's/^APP_//' | awk -F'_' '{
    result = tolower($1)
    for (i=2; i<=NF; i++) {
      result = result toupper(substr($i,1,1)) tolower(substr($i,2))
    }
    print result
  }')

  # Escape special characters in value and add to config
  escaped_value=$(echo "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo "  $key: \"$escaped_value\"," >> "$CONFIG_FILE"
done

# Close the config object
echo "};" >> "$CONFIG_FILE"

echo "Runtime configuration generated:"
cat "$CONFIG_FILE"
echo ""

# Execute the main command (nginx)
exec "$@"
