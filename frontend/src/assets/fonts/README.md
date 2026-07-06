# fonts

## Description
Local font files (e.g. WOFF2) for hosting typography files on-prem or offline.

## Design Principles
1. **Isolation**: Maintain strict isolation. Do not import feature-specific components from other sibling folders.
2. **Reusability**: Code should be organized into granular functions and components.
3. **No Direct DOM access**: Use state hooks or ref bindings.
