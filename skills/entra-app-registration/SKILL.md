---
name: entra-app-registration
description: >
  Design and configure Microsoft Entra app registrations for secure authentication and authorization.
  Use this skill when users need OAuth, OpenID Connect, API permissions, app roles, or multi-tenant identity.
  Covers auth flows, credentials, API permissions, consent models, and zero-trust patterns.
compatibility:
  models: [any-llm]
  cloud: azure
  identity: [entra-id, oauth2, oidc]
  security: [zero-trust]
---

# Entra App Registration

Design and configure secure app registrations with least privilege, proper auth flows, and automated credential rotation.
Support single-tenant, multi-tenant, and B2B scenarios.

## Use This Skill When

- The user needs to set up app authentication with Entra ID
- The user is building web apps, SPAs, APIs, or daemon services
- The user needs to integrate with Microsoft Graph or other APIs
- The user needs API scopes, app roles, or delegated permissions

## Context: Identity Maturity

**Immature**: Hard-coded secrets, no expiration, shared credentials  
**Developing**: App registrations created, some scoping of permissions  
**Managed**: Certificate-based auth, credential rotation, least-privilege scopes → **Target**  
**Optimized**: Managed identity, workload federation, passwordless, real-time token binding

## Required Inputs

- **App type**: SPA (React, Angular), Web (ASP.NET, Node), Daemon (background job), API (resource), Mobile
- **Auth flow**: Authorization Code (most common), ROPC (legacy), Client Credentials (daemon), Device Flow (IoT)
- **Tenant model**: Single-tenant (internal), Multi-tenant (SaaS), B2B (partner)
- **Redirect URIs**: Login callback URLs (e.g., `https://myapp.azurewebsites.net/auth/callback`)
- **API permissions**: Which Microsoft Graph or custom APIs does it call?
- **Credential strategy**: Certificates (preferred) or secrets (ephemeral)?

## Decision Tree

```
What type of application is this?
├─ Web app (server-side) → Authorization Code flow
├─ SPA (client-side React/Vue) → Authorization Code + PKCE
├─ Mobile/Desktop → Authorization Code + PKCE or Device Flow
├─ Daemon/Background job → Client Credentials flow
├─ API (resource server) → Define scopes for other apps to call
└─ Microsoft 365 add-in → OAuth/OpenID Connect with specific scopes

Is this single-tenant or multi-tenant?
├─ Single-tenant → Simpler: app only works in your organization
└─ Multi-tenant → Complex: other organizations can install/authorize it

Who authenticates: User or Application?
├─ User → Delegated permissions (on-behalf-of user)
└─ Application → Application permissions (app-to-app, no user)

Does it need to call other APIs?
├─ No → Minimal configuration (just sign-in)
├─ Yes → Add API permissions, request at sign-in or runtime
└─ Daemon → App permissions only (no user)

How to manage credentials?
├─ Development/Testing → Secrets (short-lived)
└─ Production → Certificates or managed identity (via workload federation)
```

## Workflow

### Phase 1: Create App Registration

1. **Register application**:
   ```bash
   az ad app create \
     --display-name "MyApp" \
     --public-client-redirect-uris "https://localhost:3000/auth/callback" \
     --enable-id-token-issuance true \
     --enable-access-token-issuance true
   
   APP_ID=$(az ad app list --display-name "MyApp" --query "[0].appId" -o tsv)
   TENANT_ID=$(az account show --query tenantId -o tsv)
   ```

2. **Register service principal** (represents app in tenant):
   ```bash
   az ad sp create --id $APP_ID
   ```

3. **Set token configuration** (what claims in token):
   ```bash
   # Via portal: Token Configuration → Add optional claim
   # Or via CLI: az ad app update --id $APP_ID --optional-claims ...
   ```

### Phase 2: Configure Platform & Redirect URIs

1. **For web apps**:
   ```bash
   # Add redirect URIs (where to send auth code after login)
   az ad app update --id $APP_ID \
     --reply-urls "https://myapp.azurewebsites.net/auth/callback" \
                  "http://localhost:3000/auth/callback" \
     --logout-urls "https://myapp.azurewebsites.net/logout"
   ```

2. **For SPAs** (React, Vue, Angular):
   ```bash
   # Treat as public client (no secret needed)
   az ad app update --id $APP_ID \
     --public-client-redirect-uris "https://myapp.azurewebsites.net/" \
                                   "http://localhost:3000/"
   # Enable PKCE: Portal → Authentication → Treat app as public client (✓)
   ```

3. **For desktop/mobile apps**:
   ```bash
   # Mobile: myapp://auth
   # Desktop: http://localhost:port/redirect
   az ad app update --id $APP_ID \
     --public-client-redirect-uris "myapp://auth" \
                                   "http://localhost:7777/redirect"
   ```

### Phase 3: Add API Permissions

1. **Request Microsoft Graph access**:
   ```bash
   # Delegate (user's behalf): Read user profile, calendar
   az ad app permission add --id $APP_ID \
     --api 00000003-0000-0000-c000-000000000000 \
     --api-permissions "e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope" \
                       "14dad69e-099b-42c9-810b-d002981feee1=Scope"
   
   # Application (as itself): Read all users (admin consent required)
   az ad app permission add --id $APP_ID \
     --api 00000003-0000-0000-c000-000000000000 \
     --api-permissions "9a6d68d0-fcf5-4d9f-b6c5-5ff2e6bba1d5=Role"
   ```

2. **Request custom API access**:
   ```bash
   # If calling your own API, get its app ID
   CUSTOM_API_ID=$(az ad app list --display-name "MyCustomAPI" --query "[0].appId" -o tsv)
   
   az ad app permission add --id $APP_ID \
     --api $CUSTOM_API_ID \
     --api-permissions "scope-uuid=Scope"
   ```

3. **Admin consent** (required for app permissions):
   ```bash
   # Portal: API Permissions → Grant admin consent for [Tenant]
   # Or: Redirect user to consent URL with scope
   # https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize?client_id=...&scope=...
   ```

### Phase 4: Define Exposed Scopes (if this is an API)

1. **Expose scopes for other apps to call**:
   ```bash
   # Portal: Expose an API → Add a scope
   # Scope: api://myapp-id/Orders.Read
   # Display name: "Read Orders"
   # Admin consent description: "App can read orders on user's behalf"
   ```

   ```bash
   # CLI (register scope)
   az ad app update --id $APP_ID \
     --api-definition '{
       "requestedAccessTokenVersion": 2,
       "oauth2PermissionScopes": [{
         "adminConsentDescription": "Allow app to read orders",
         "adminConsentDisplayName": "Read Orders",
         "id": "scope-uuid",
         "isEnabled": true,
         "type": "User",
         "userConsentDescription": "Read your orders",
         "userConsentDisplayName": "Read Orders",
         "value": "Orders.Read"
       }]
     }'
   ```

2. **Define app roles** (for role-based access):
   ```json
   {
     "appRoles": [
       {
         "id": "admin-uuid",
         "displayName": "Admin",
         "description": "Can manage orders",
         "value": "Orders.Manage",
         "allowedMemberTypes": ["Application", "User"]
       }
     ]
   }
   ```

### Phase 5: Configure Credentials

1. **Certificate-based (preferred for production)**:
   ```bash
   # Generate self-signed cert (1 year valid)
   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes \
     -subj "/CN=MyApp"
   
   # Upload to app registration
   az ad app credential reset --id $APP_ID --cert @cert.pem --append
   ```

2. **Secret-based (development/testing)**:
   ```bash
   # Create secret (2-year expiration)
   SECRET=$(az ad app credential reset --id $APP_ID --display-name "dev-secret" \
     --years 2 --query "credential.secretText" -o tsv)
   
   # SAVE TO KEY VAULT (never in code/config)
   az keyvault secret set --vault-name $KV --name "app-registration-secret" --value "$SECRET"
   ```

3. **Rotate credentials**:
   ```bash
   # Create new secret before old one expires
   az ad app credential reset --id $APP_ID --display-name "new-secret"
   
   # Update apps to use new secret from Key Vault
   # Delete old secret
   az ad app credential delete --id $APP_ID --key-id $OLD_KEY_ID
   ```

### Phase 6: Obtain Tokens in Application

**Example 1: ASP.NET Core Web App**
```csharp
// Sign-in user with Authorization Code flow
services.AddMicrosoftIdentityWebAppAuthentication(Configuration)
  .AddMicrosoftGraph(Configuration.GetSection("MicrosoftGraph"))
  .AddInMemoryTokenCaches();

// In controller: User automatically authenticated via middleware
[Authorize]
public async Task<IActionResult> Profile() {
  var user = User; // User object available
  return Ok(user);
}
```

**Example 2: React SPA**
```javascript
import React from 'react';
import { MsalProvider, useMsal, useAccount } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: `https://login.microsoftonline.com/YOUR_TENANT_ID`,
    redirectUri: window.location.origin,
  }
};

const pca = new PublicClientApplication(msalConfig);

export function App() {
  const { accounts, instance } = useMsal();
  
  const handleLogin = async () => {
    const response = await instance.loginPopup({
      scopes: ["openid", "profile", "email"]
    });
    console.log(response);
  };

  return <button onClick={handleLogin}>Login</button>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <MsalProvider instance={pca}>
    <App />
  </MsalProvider>
);
```

**Example 3: Daemon (Client Credentials)**
```csharp
// No user involved; app authenticates as itself
var credential = new ClientSecretCredential(
  tenantId, clientId, clientSecret,
  new TokenCredentialOptions { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud }
);

var client = new GraphServiceClient(credential);
var users = await client.Users.GetAsync();
```

### Phase 7: Validate & Test

1. **Test sign-in flow**:
   ```bash
   # Use MSAL playground: https://ms.dev/msal-js-playground
   # Or local app: curl + redirect flow
   
   # Get auth code
   curl "https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/authorize?client_id=$CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=openid%20profile%20email" 
   
   # Exchange code for token
   curl -X POST \
     -d "client_id=$CLIENT_ID&client_secret=$SECRET&grant_type=authorization_code&code=$CODE&redirect_uri=http://localhost" \
     "https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/token"
   ```

2. **Inspect token**:
   ```bash
   # Decode JWT token (on jwt.ms or locally)
   # Verify:
   # - Correct issuer (https://login.microsoftonline.com/{tenant}/v2.0)
   # - Correct audience (your client ID)
   # - Requested scopes present
   # - Expiration reasonable
   ```

## Output Contract

1. **App Registration Summary**
   - App ID (client ID), tenant ID, object ID
   - Auth flow chosen and justification
   - Single/multi-tenant mode

2. **Configuration for Application**
   - Authority URL: `https://login.microsoftonline.com/{tenant-id}`
   - Scopes requested: `openid profile email api://myapp/Orders.Read`
   - Redirect URIs registered
   - Secret location (Key Vault reference)

3. **API Permissions & Scopes**
   - Microsoft Graph permissions (delegated + application)
   - Custom API scopes exposed (if this is an API)
   - Admin consent URLs or instructions

4. **Credential Management Plan**
   - Certificate thumbprint or secret name in Key Vault
   - Rotation schedule (every 12 months)
   - Deprovisioning process

5. **Implementation Checklist**
   - MSAL library added to project
   - Sign-in UI/UX
   - Token caching strategy
   - Refresh token handling

## Guardrails

- **Prefer certificates over secrets**: Self-signed cert rotated annually is safer than long-lived secret.
- **Never output secrets in plain text**: Store in Key Vault, reference with managed identity.
- **Request minimal permissions**: Only request scopes actually needed (principle of least privilege).
- **Enable PKCE for SPAs**: Prevents authorization code interception.
- **Use implicit flow for SPA**: Deprecated; use Authorization Code + PKCE instead.
- **Test token expiration**: Ensure apps handle 401 and request fresh token.
- **Secure the refresh token**: Store in secure, httpOnly cookie or OS credential store (never localStorage).
- **Monitor token usage**: Ensure tokens not being replayed or misused (Application Insights).
