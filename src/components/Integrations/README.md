# Fivetran Integrations

This module provides a complete integration system for connecting external data sources through Fivetran.

## Components

### 1. GoogleBusinessProfile

A complete integration component for Google Business Profile.

```tsx
import { GoogleBusinessProfile } from "../components/Integrations";

<GoogleBusinessProfile organisationId={organisationId} className="mb-3" />;
```

**Props:**

- `organisationId?: number` - The organisation ID for the current tenant
- `className?: string` - Additional CSS classes

**Features:**

- ✅ OAuth flow handling
- ✅ Connection status display
- ✅ Sync status tracking
- ✅ Error handling
- ✅ Token expiry warnings
- ✅ Disconnect functionality

### 2. IntegrationsPage

A dedicated page for managing all integrations.

```tsx
import { IntegrationsPage } from "../components/Integrations";

// Use in routing
<Route path="/integrations" component={IntegrationsPage} />;
```

### 3. IntegrationsWidget

A dashboard widget showing integration overview.

```tsx
import { IntegrationsWidget } from "../components/Integrations";

// Use in dashboard
<IntegrationsWidget />;
```

## Hooks

### useGoogleBusinessIntegration

Custom hook for managing Google Business Profile integration state.

```tsx
import { useGoogleBusinessIntegration } from "../hooks/useGoogleBusinessIntegration";

const {
  isConnected,
  connectionStatus,
  hasValidToken,
  connect,
  disconnect,
  isLoading,
} = useGoogleBusinessIntegration({ organisationId });
```

**Returns:**

- `isConnected: boolean` - Whether integration is connected
- `connectionStatus: string` - Current connection status
- `hasValidToken: boolean` - Whether access token is valid
- `connect: () => void` - Function to start OAuth flow
- `disconnect: () => void` - Function to disconnect
- `isLoading: boolean` - Loading state
- And more...

## Services

### fivetranService

API service for Fivetran operations.

```tsx
import fivetranService from "../services/fivetranService";

// Start OAuth flow
const authData = await fivetranService.startGoogleBusinessAuth(organisationId);

// Get status
const status = await fivetranService.getGoogleBusinessStatus(organisationId);

// Disconnect
await fivetranService.disconnectGoogleBusiness(organisationId);
```

## Adding New Integrations

To add a new integration (e.g., Facebook Ads):

1. **Create the component:**

```tsx
// components/Integrations/FacebookAds.tsx
const FacebookAds: React.FC<FacebookAdsProps> = ({ organisationId }) => {
  // Similar structure to GoogleBusinessProfile
};
```

2. **Add to the service:**

```tsx
// services/fivetranService.ts
async startFacebookAdsAuth(organisationId: number) {
  // Implementation
}
```

3. **Create a hook:**

```tsx
// hooks/useFacebookAdsIntegration.ts
export const useFacebookAdsIntegration = ({ organisationId }) => {
  // Similar to useGoogleBusinessIntegration
};
```

4. **Add to backend routes:**

```php
// Laravel routes
Route::get('/facebook-ads/auth/start', 'FacebookAdsController@redirectToFacebook');
Route::get('/facebook-ads/auth/callback', 'FacebookAdsController@handleCallback');
```

## Backend Integration

The frontend expects these API endpoints:

### Google Business Profile

- `GET /admin/v1/google-business/auth/start?organisation_id={id}`
- `GET /admin/v1/google-business/auth/callback`
- `GET /admin/v1/google-business/status?organisation_id={id}`
- `POST /admin/v1/google-business/disconnect`

### Expected Response Formats

**Auth Start:**

```json
{
  "auth_url": "https://...",
  "state": "...",
  "connector_id": 123
}
```

**Status:**

```json
{
  "connected": true,
  "status": "connected",
  "connector_name": "Google Business Profile",
  "connected_at": "2025-01-01T00:00:00Z",
  "last_sync_at": "2025-01-01T12:00:00Z",
  "has_valid_token": true,
  "latest_sync": {
    "status": "completed",
    "records_synced": 1500
  }
}
```

## Environment Variables

The frontend uses these configurations automatically from the API base URL:

```typescript
// Configured in src/utils/constants.ts
const config = {
  adminApiBaseUrl: "http://localhost:4000/admin/v1/", // Development
};
```

## Error Handling

The system includes comprehensive error handling:

- **Network errors:** Handled by axios interceptors
- **OAuth errors:** Popup handling with user feedback
- **Token expiry:** Automatic detection and user warnings
- **API errors:** Toast notifications with appropriate messages

## Security

- **Token encryption:** All OAuth tokens are encrypted in the backend
- **State validation:** OAuth state parameters prevent CSRF attacks
- **Popup isolation:** OAuth flows run in isolated popup windows
- **Auto-cleanup:** Expired tokens are automatically detected
